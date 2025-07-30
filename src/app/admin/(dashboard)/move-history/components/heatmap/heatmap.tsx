// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import Map from 'react-map-gl';
// import { DeckGL } from '@deck.gl/react';
// import { HeatmapLayer } from '@deck.gl/layers';
// import 'mapbox-gl/dist/mapbox-gl.css';

// const INITIAL_VIEW_STATE = {
//   longitude: 126.978, // 서울 중심 경도
//   latitude: 37.5665,   // 서울 중심 위도
//   zoom: 11,
//   pitch: 0,
//   bearing: 0,
// };

// const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// export default function Heatmap() {
//   const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
//   const [data, setData] = useState([]);

//   // 지도 경계가 변경될 때마다 데이터를 가져오는 함수
//   const fetchData = useCallback(async (bounds) => {
//     if (!bounds) return;

//     const [[sw_lng, sw_lat], [ne_lng, ne_lat]] = bounds;
//     const response = await fetch(`/api/locations?sw_lng=${sw_lng}&sw_lat=${sw_lat}&ne_lng=${ne_lng}&ne_lat=${ne_lat}`);
//     const result = await response.json();
//     setData(result);
//   }, []);

//   // 뷰 상태가 변경이 끝나면(onViewStateChange의 상호작용이 끝나면) 호출
//   const handleInteractionEnd = (newViewState) => {
//     // DeckGL의 getBounds() 메소드를 사용하여 현재 보이는 영역의 경계를 가져옵니다.
//     // 이 부분은 DeckGL 인스턴스에 대한 ref를 사용하거나 다른 방법으로 경계를 계산해야 할 수 있습니다.
//     // 간단한 예시로, 뷰 상태 변경 시 다시 데이터를 가져오도록 합니다.
//     // 실제로는 getBounds()와 같은 유틸리티 함수를 사용하는 것이 더 정확합니다.
//     // 여기서는 viewState를 기반으로 다시 데이터를 불러오는 로직을 단순화하여 표현합니다.
//   };

//   const layers = [
//     new HeatmapLayer({
//       id: 'heatmapLayer',
//       data,
//       getPosition: d => [d[0], d[1]], // 데이터 형식에 맞게 위치 반환
//       getWeight: 1, // 모든 포인트의 가중치를 1로 설정
//       aggregation: 'SUM',
//       // 색상 범위: 옅은 색 -> 중간 색 -> 짙은 붉은색
//       colorRange: [
//         [255, 255, 178, 128],
//         [254, 204, 92, 128],
//         [253, 141, 60, 128],
//         [240, 59, 32, 128],
//         [189, 0, 38, 128],
//       ],
//       // 붉은색으로 갈수록 임계값
//       threshold: 0.1,
//       // 히트맵의 강도
//       intensity: 3,
//       // 각 데이터 포인트의 영향 반경 (픽셀 단위)
//       radiusPixels: 30,
//     }),
//   ];

//   return (
//     <DeckGL
//       initialViewState={INITIAL_VIEW_STATE}
//       controller={true}
//       layers={layers}
//       onViewStateChange={({ viewState }) => setViewState(viewState)}
//       // 상호작용이 끝날 때 데이터를 다시 불러오기 위한 로직
//       // onInteractionStateChange 또는 다른 콜백을 활용하여 최적화 가능
//     >
//       <Map
//         {...viewState}
//         mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
//         mapStyle="mapbox://styles/mapbox/dark-v11" // 원하는 지도 스타일
//       />
//     </DeckGL>
//   );
// }