Feature: Kullanici Giris Fonksiyonu

Scenario: Kullanici gecerli verilerle giris yapabilmeli.

Given   Kullanici "https://practicetestautomation.com/practice-test-login/" adresine gider.
And     Kullanici adi "studenffft" girilir.
And     Sifre "Passfsdafasd" girilir.
And     "Submit" text degerine sahip butona tiklanir.
Then    "Logged In Successfully" yazisi gorundugu dogrulanir.
