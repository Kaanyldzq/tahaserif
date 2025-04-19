# Yıldız Sayısına Göre Filtreleme

Bu bileşen, otel/mekan arama sonuçlarını yıldız sayısına göre filtreleme imkanı sunan bir React bileşenidir.

## Özellikler

- Yıldız sayısına göre checkbox filtreleme (1-5 yıldız)
- Yıldız aralığına göre slider ile filtreleme
- Aktif filtreleri görüntüleme ve tek tek kaldırabilme
- Responsive tasarım
- Filtrelenmiş ve boş sonuç durumlarının yönetimi
- Temiz ve kullanıcı dostu arayüz

## Kullanılan Teknolojiler

- React Hooks (useState, useEffect)
- Material-UI bileşenleri
- CSS-in-JS styling
- Responsive Grid tasarım

## Bileşen Yapısı

- Filtre bölümü
  - Checkbox filtreleri (1-5 yıldız arası seçim)
  - Slider ile yıldız aralığı filtreleme
  - Aktif filtreleri gösteren chip'ler
  - Filtreleri sıfırlama butonu

- Sonuçlar bölümü
  - Bulunan otel sayısı bilgisi
  - Responsive kart görünümü
  - Her kartta otel bilgileri ve yıldız değerlendirmesi
  - Boş sonuç durumu için uyarı mesajı

## Kullanım

```jsx
import YildizFiltreleme from './YildizFiltreleme';

function App() {
  return (
    <div className="App">
      <YildizFiltreleme />
    </div>
  );
}
```

## Geliştirici

Kaan Yıldız 