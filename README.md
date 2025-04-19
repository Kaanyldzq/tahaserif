# Konaklama Fotoğrafı Düzenleme

Bu bileşen, Tatilim uygulaması için konaklama tesisi fotoğraflarının düzenlenmesine olanak sağlar.

## Özellikler

* Fotoğraf kategorilerine göre filtreleme (Genel, Odalar, Havuz, Restoran vb.)
* Fotoğrafları başlık ve açıklamaya göre arama
* Fotoğraf başlık, açıklama ve kategorilerini düzenleme
* Ana fotoğraf olarak işaretleme ve değiştirme özelliği
* Snackbar bildirimleri ile kullanıcı geri bildirimi
* Duyarlı (responsive) tasarım

## Kullanılan Teknolojiler

* React 18
* Material-UI 5
* React Hooks (useState, useEffect)
* Responsive Design

## Kullanım

```javascript
import KonaklamaFotografiDuzenleme from './KonaklamaFotografiDuzenleme';

function App() {
  return (
    <div className="App">
      <KonaklamaFotografiDuzenleme 
        konaklamaId="hotel123" 
        konaklamaAd="Grand Hotel & Spa" 
      />
    </div>
  );
}
```

## Ekran Görüntüleri

Fotoğraf listeleme, filtreleme ve düzenleme ekranları:

* Tüm fotoğrafları listeleme ve kategori filtreleme
* Fotoğraf düzenleme dialog'u
* Ana fotoğraf değiştirme onay dialog'u

## Kurulum

1. Repository'yi klonlayın
2. Bağımlılıkları yükleyin: `npm install`
3. Uygulamayı başlatın: `npm start`

## Geliştirici

Kaan Yıldız - 2025 