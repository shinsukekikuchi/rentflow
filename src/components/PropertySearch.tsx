'use client';

import { useState } from 'react';
import { Property } from '../types/property';

export default function PropertySearch() {
  const [query, setQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Sending request with query:', { query }); // リクエストの内容をログ出力

      const response = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('Response status:', response.status); // レスポンスのステータスをログ出力

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData); // エラーレスポンスの内容をログ出力
        throw new Error(
          errorData?.detail || `エラーが発生しました (${response.status})`
        );
      }

      const data = await response.json();
      console.log('Response data:', data); // レスポンスデータをログ出力
      setProperties(data.properties || []);
    } catch (err) {
      console.error('Error during search:', err); // エラーオブジェクトをログ出力
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: ペット可で駅から10分以内、フリーランスOK、家賃8万円以下"
            className="flex-1 p-3 border rounded-lg text-black"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-600">{error}</p>
        )}
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-bold mb-2">{property.name}</h3>
            <p className="text-gray-600 mb-2">{property.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">家賃:</span> ¥{property.price.toLocaleString()}</p>
                <p><span className="font-semibold">場所:</span> {property.location}</p>
              </div>
              <div>
                <p><span className="font-semibold">駅からの距離:</span> {property.distance_to_station}分</p>
                <p><span className="font-semibold">特徴:</span> {property.features.join(', ')}</p>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              {property.pet_friendly && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">ペット可</span>
              )}
              {property.freelancer_friendly && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">フリーランス可</span>
              )}
            </div>
          </div>
        ))}
        {properties.length === 0 && !loading && (
          <p className="text-center text-gray-600">物件が見つかりませんでした</p>
        )}
      </div>
    </div>
  );
}
