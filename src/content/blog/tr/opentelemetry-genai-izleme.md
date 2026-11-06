---
title: "OpenTelemetry GenAI: Ajan İzlerini Standart Bir Şemayla Toplamak"
description: "gen_ai.* konvansiyonları hâlâ kararlı değil ama ajan izleme için tek standart bu. Span ağacı, operasyon adları, MCP trace yayılımı ve sürüm sabitleme."
publishDate: "2026-08-13T23:49:00+03:00"
lang: tr
category: "Gözlemlenebilirlik"
tags: ["Gözlemlenebilirlik", "Yapay Zeka"]
translation: "opentelemetry-genai-tracing"
heroImage:
  src: "../../../assets/blog/covers/opentelemetry-genai-izleme.jpg"
  alt: "OpenTelemetry GenAI: Ajan İzlerini Standart Bir Şemayla Toplamak"
---

Bir ajan çağrısı bozulduğunda "hangi adımda ne oldu" sorusuna cevap verebilmek, hangi izleme aracını kullandığınıza değil, izleri hangi şemayla yazdığınıza bağlıdır. Şema kendinize özgüyse, aracı değiştirdiğinizde her şeyi yeniden yazarsınız. 2026'da bunun bir standardı var — ama o standardın en önemli özelliği henüz kararlı olmaması ve doğru mühendislik duruşunun bunu bilerek benimsemek olması.

## Neden kendi şemanızı yazmamalısınız?

Çoğu ekip LLM izlemeye kendi JSON günlükleriyle başlar: model adı, token sayısı, süre. Bu üç ay iyi çalışır. Sonra bir ajan eklersiniz ve iç içe adımları göstermek gerekir; sonra bir gözlemlenebilirlik ürünü alırsınız ve şemanızı ona uydurmak zorunda kalırsınız; sonra ekipteki ikinci sistem farklı alan adları kullanır ve iki sistemi karşılaştıramazsınız.

> İzleme şeması, sonradan değiştirilmesi en pahalı karardır — çünkü geçmiş veriyi geri dönüştüremezsiniz.

OpenTelemetry'nin GenAI anlamsal konvansiyonları tam olarak bu sorunu çözüyor: alan adlarını ve span yapısını standartlaştırıyor, böylece izleri yazan kod ile onları gösteren araç birbirinden bağımsız hâle geliyor.

## Kararlı değil — ve bu ne demek?

Pratik manşet bu. Her `gen_ai.*` özniteliği, span'ı, metriği ve olayı hâlâ **Development** rozetiyle işaretli; hiçbiri Stable değil. Üstelik konvansiyonlar ev değiştirdi: **v1.42.0 (12 Haziran 2026)** ile ana `semantic-conventions` deposundan çıkıp ayrı bir `open-telemetry/semantic-conventions-genai` deposuna taşındılar. Yeni depo GenAI istemcilerini, **MCP**'yi ve sağlayıcıya özgü konvansiyonları kapsıyor.

Doğru mühendislik duruşu şu: **şimdi benimseyin, ama sürümü sabitleyin.** Kendi şemanızı icat etmek daha kötü bir seçenek; ama sürüm sabitlemeden benimsemek, bir yükseltmede panolarınızın sessizce boşalması demek.

<div class="callout"><strong>İpucu:</strong> Kullandığınız konvansiyon sürümünü izin verdiği yerde bir kaynak (resource) özniteliği olarak yazın ve dağıtım notlarınıza koyun. Bir alan adı değiştiğinde, hangi tarihten sonraki verinin yeni şemada olduğunu bilmek sorguları kurtarır.</div>

## Span ağacı: bir ajan koşusu nasıl görünür?

Konvansiyonların en değerli katkısı, bir ajan koşusunu tek bir çağrı değil bir **span ağacı** olarak modellemesi. Merkezî öznitelik `gen_ai.operation.name` ve aldığı değerler ajan mimarisinin sözlüğüyle birebir örtüşüyor: `create_agent`, `invoke_agent`, `invoke_workflow`, `execute_tool`, `retrieval`, `plan` ve bellek işlemleri.

```text
invoke_agent  destek-ajani                       12.4s
├─ plan                                           1.9s
├─ retrieval  sozlesme-indeksi                    0.6s   (8 parca)
├─ execute_tool  musteri_getir                    0.3s
├─ chat  claude-sonnet-4-5                        3.1s   (in 8.2k / out 412)
├─ execute_tool  fatura_olustur                   0.9s   ERROR timeout
├─ execute_tool  fatura_olustur  (yeniden deneme) 1.1s
└─ chat  claude-sonnet-4-5                        3.4s   (in 9.9k / out 260)
```

Bu ağaç, düz günlüklerin cevaplayamadığı soruları cevaplar: gecikme nerede birikti, hangi araç yeniden denendi, kaç token nerede harcandı, ve aynı görevin iki koşusu neden farklı davrandı.

## Çalışan bir enstrümantasyon

Kütüphane kullanmadan, elle enstrümantasyon şöyle görünür — asıl mesele öznitelik adlarını doğru yazmak:

```python
from opentelemetry import trace

tracer = trace.get_tracer("uygulama.ajan")

def ajani_calistir(gorev, arac_kutusu):
    with tracer.start_as_current_span("invoke_agent destek-ajani") as ajan_span:
        ajan_span.set_attribute("gen_ai.operation.name", "invoke_agent")
        ajan_span.set_attribute("gen_ai.agent.name", "destek-ajani")
        ajan_span.set_attribute("gen_ai.conversation.id", gorev.oturum_id)

        for adim in gorev.adimlar():
            if adim.tur == "model":
                with tracer.start_as_current_span("chat") as s:
                    s.set_attribute("gen_ai.operation.name", "chat")
                    s.set_attribute("gen_ai.provider.name", "anthropic")
                    s.set_attribute("gen_ai.request.model", adim.model)
                    yanit = adim.calistir()
                    s.set_attribute("gen_ai.usage.input_tokens",  yanit.girdi)
                    s.set_attribute("gen_ai.usage.output_tokens", yanit.cikti)
                    s.set_attribute("gen_ai.response.finish_reasons",
                                    [yanit.bitis_nedeni])

            elif adim.tur == "arac":
                with tracer.start_as_current_span("execute_tool") as s:
                    s.set_attribute("gen_ai.operation.name", "execute_tool")
                    s.set_attribute("gen_ai.tool.name", adim.arac)
                    try:
                        adim.calistir()
                    except Exception as e:
                        s.set_status(trace.StatusCode.ERROR, str(e))
                        s.record_exception(e)
                        raise
```

Buradaki disiplin şu: _her_ model çağrısı ve _her_ araç çağrısı ayrı bir span olsun ve ikisi de aynı üst span'ın altında dursun. Ajan koşusunu tek bir span olarak kaydetmek, en yaygın ve en pahalı enstrümantasyon hatasıdır.

## MCP ile trace bağlamı yayılımı

2026'nın sessiz ama önemli gelişmesi: iki standart birbirine yakınsadı. MCP'nin `2026-07-28` revizyonu, OpenTelemetry trace bağlamının `_meta` anahtarlarıyla taşınmasını belgeliyor — `traceparent`, `tracestate` ve `baggage`.

Pratik sonuç büyük: istemcinizdeki bir ajan koşusu ile başka bir makinede çalışan MCP sunucusundaki araç çalıştırması **aynı iz ağacında** görünebilir. Sunucu tarafındaki yavaşlığı istemci tarafındaki gecikmeyle ilişkilendirmek, bu bağlantı olmadan mümkün değildi.

```json
{
  "method": "tools/call",
  "params": {
    "name": "fatura_olustur",
    "arguments": { "musteri": "…" },
    "_meta": {
      "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
      "io.modelcontextprotocol/protocolVersion": "2026-07-28"
    }
  }
}
```

MCP sunucusu yazıyorsanız gelen `traceparent`'ı okuyup kendi span'larınızı onun altına bağlayın; MCP istemcisi yazıyorsanız her araç çağrısına mevcut bağlamı yazın. İki satırlık iş, sonrasında en zor hata ayıklama sorusunu çözer.

## Ne kaydetmeli, ne kaydetmemeli?

Buradaki tek büyük karar prompt ve yanıt içeriğinin kaydedilip kaydedilmeyeceğidir. İçerik olmadan hata ayıklamak zordur; içerikle birlikte izleme sisteminiz kişisel veri deposu hâline gelir.

-   **Varsayılan olarak içeriği kaydetmeyin.** Bunun yerine uzunluk, token sayısı, şema doğrulama sonucu ve hash kaydedin.
-   **Örnekleme yapın.** Hata durumlarının tamamını, başarılı çağrıların küçük bir oranını (%1 gibi) içerikle kaydedin.
-   **Maskeleyin.** Kişisel veri alanlarını izleme katmanında değil, ondan önce temizleyin.
-   **Saklama süresi verin.** İçerikli izler kısa, metrik izler uzun saklansın.

Son olarak metrik tarafını ihmal etmeyin: token kullanımı, araç hata oranı, adım sayısı ve görev başına maliyet, izlerden türetilebilecek ama ayrıca metrik olarak yayılması gereken değerlerdir. İz örneklenir; metrik örneklenmez.

<div class="takeaways"><h4>Öne çıkanlar</h4><ul><li>Kendi izleme şemanızı icat etmeyin; sonradan değiştirilmesi en pahalı karar budur.</li><li><code>gen_ai.*</code> konvansiyonlarının hepsi hâlâ Development durumunda ve v1.42.0 ile ayrı bir depoya taşındı — benimseyin ama sürümü sabitleyin.</li><li>Ajan koşusunu tek span olarak değil, <code>invoke_agent</code> altında <code>chat</code> ve <code>execute_tool</code> span'larından oluşan bir ağaç olarak kaydedin.</li><li>MCP artık <code>_meta</code> içinde <code>traceparent</code> taşıyor; istemci ve sunucu izlerini tek ağaçta birleştirin.</li></ul></div>

<div class="faq"><details><summary>OpenTelemetry GenAI konvansiyonları nedir?</summary><p>LLM ve ajan çağrılarının izlerde hangi öznitelik adlarıyla ve hangi span yapısıyla kaydedileceğini tanımlayan standarttır. Merkezinde <code>gen_ai.operation.name</code> bulunur ve bir ajan koşusunu <code>invoke_agent</code>, <code>execute_tool</code>, <code>retrieval</code>, <code>plan</code> gibi span'lardan oluşan bir ağaç olarak modeller.</p></details><details><summary>Konvansiyonlar kararlı değilse kullanmalı mıyım?</summary><p>Evet, ama sürümü sabitleyerek. Alternatif kendi şemanızı icat etmek ve bir gözlemlenebilirlik ürününe geçtiğinizde her şeyi yeniden yazmak. Kullandığınız konvansiyon sürümünü kayıt altına alın ve yükseltmeyi bilinçli bir değişiklik olarak planlayın.</p></details><details><summary>Prompt içeriğini izlere yazmalı mıyım?</summary><p>Varsayılan olarak hayır. Uzunluk, token sayısı, şema sonucu ve hash çoğu hata ayıklama sorusunu cevaplar. İçeriği yalnızca hata durumlarında ve başarılı çağrıların küçük bir örnekleminde, kişisel veri maskelenmiş ve saklama süresi kısaltılmış olarak kaydedin.</p></details></div>

---

Standart bir şema, izleme aracınızı değiştirebilir kılar — asıl kazanç budur. Gözlemlenebilirliğin genel çerçevesi için [LLM gözlemlenebilirlik](/posts/llm-gozlemlenebilirlik/), izlerden çıkan verinin nasıl puana dönüştüğü için [ajan değerlendirmesi](/posts/ajan-degerlendirmesi/), ve bu katmanın oturacağı dağıtım disiplini için [MLOps ve üretime alma](/posts/mlops-uretim/) yazılarına bakabilirsiniz.
