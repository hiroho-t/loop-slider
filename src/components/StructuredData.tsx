interface StructuredDataProps {
  title: string;
  description: string;
  url: string;
}

export const StructuredData = ({ title, description, url }: StructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": description,
    "url": url,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "provider": {
      "@type": "Organization",
      "name": "StartWith Inc.",
      "url": "https://startwith.studio.site/"
    },
    "featureList": [
      "画像URLからカルーセルスライダーを生成",
      "iframe埋め込みコードの自動生成",
      "ループアニメーション速度の調整",
      "レスポンシブ対応"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};