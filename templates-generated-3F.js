// ============ 自動生成: 3階建てテンプレ (2m刻み 13m〜16m) ============
// 既存3Fテンプレ(7-11m 範囲)を補完し、16m まで対応。
// 各サイズ × 接道(S/N/E) = 3 × 3 = 9件追加。西接道は index.html 側で自動ミラー。
//
// サイズ: 13, 15, 16 (m)
// レイアウト方針:
//   - 建物グリッド = round((sizeM - 5) / 0.91) で土地より約5m小さい正方形(3階分の余裕)
//   - 都市型狭小3F: 1F に水回り+玄関+和室、2F に LDK(中心階で採光)、3F に寝室
//   - 3-strip / 3-column 構造で階段位置を全階で揃えて直下率を確保

(function() {
  const M_PER_GRID = 0.91;
  const SIZES = [13, 15, 16];

  function gridSize(sizeM) {
    // 3F は1F/2Fよりさらに余裕(狭小都市型を想定)
    return Math.max(9, Math.round((sizeM - 5) / M_PER_GRID));
  }
  function landRange(sizeM) {
    return { minW: sizeM - 1, maxW: sizeM + 1, minH: sizeM - 1, maxH: sizeM + 1 };
  }
  function commonVR() {
    return [
      { match: { type: "LDK", floor: 2 }, allowedTatami: [12, 14, 16, 18, 20, 22, 24] },
      { match: { type: "寝室", floor: 3, role: "main" }, allowedTatami: [6, 7, 8, 10] }
    ];
  }

  // ---- 南接道 3階建て ----
  function south3F(sizeM) {
    const g  = gridSize(sizeM);
    const s  = Math.max(2, Math.floor(g / 3));   // 南/中央帯の高さ
    const sn = g - s * 2;                        // 北帯の高さ
    const h  = Math.max(2, Math.floor(g / 4));   // 各列の幅
    const hr = g - h * 3;                        // 東端余り幅
    const rooms = [
      // ---- 1F: 玄関+水回り+和室 ----
      // 南帯: 物入 / 玄関 / SC / 風呂
      { type: "物入", floor: 1, x: 0,    y: 0, w: h,  h: s, tatami: h*s/2 },
      { type: "玄関", floor: 1, x: h,    y: 0, w: h,  h: s, tatami: h*s/2 },
      { type: "SC",   floor: 1, x: h*2,  y: 0, w: h,  h: s, tatami: h*s/2 },
      { type: "風呂", floor: 1, x: h*3,  y: 0, w: hr, h: s, tatami: hr*s/2 },
      // 中央帯: 階段 / 廊下 / 洗面 / トイレ
      { type: "階段",  floor: 1, x: 0,    y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "廊下",  floor: 1, x: h,    y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "洗面",  floor: 1, x: h*2,  y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "トイレ",floor: 1, x: h*3,  y: s, w: hr, h: s, tatami: hr*s/2 },
      // 北帯: 和室 (全幅)
      { type: "和室", floor: 1, x: 0, y: s*2, w: g, h: sn, tatami: g*sn/2 },

      // ---- 2F: LDK 中心階 ----
      // 南帯: LDK (全幅)
      { type: "LDK", floor: 2, x: 0, y: 0, w: g, h: s, tatami: g*s/2 },
      // 中央帯: 階段(直下) / 廊下 / 洗面 / トイレ
      { type: "階段",  floor: 2, x: 0,    y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "廊下",  floor: 2, x: h,    y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "洗面",  floor: 2, x: h*2,  y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "トイレ",floor: 2, x: h*3,  y: s, w: hr, h: s, tatami: hr*s/2 },
      // 北帯: 収納
      { type: "WIC",  floor: 2, x: 0,    y: s*2, w: h*2, h: sn, tatami: h*2*sn/2 },
      { type: "物入", floor: 2, x: h*2,  y: s*2, w: h,   h: sn, tatami: h*sn/2 },
      { type: "物入", floor: 2, x: h*3,  y: s*2, w: hr,  h: sn, tatami: hr*sn/2 },

      // ---- 3F: 寝室階 ----
      // 南帯: 主寝室 + 子供部屋
      { type: "寝室", role: "main", floor: 3, x: 0,    y: 0, w: h*2,    h: s, tatami: h*2*s/2 },
      { type: "子供部屋",           floor: 3, x: h*2,  y: 0, w: h + hr, h: s, tatami: (h+hr)*s/2 },
      // 中央帯: 階段(直下) / 廊下 / トイレ / 洗面
      { type: "階段",  floor: 3, x: 0,    y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "廊下",  floor: 3, x: h,    y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "トイレ",floor: 3, x: h*2,  y: s, w: h,  h: s, tatami: h*s/2 },
      { type: "洗面",  floor: 3, x: h*3,  y: s, w: hr, h: s, tatami: hr*s/2 },
      // 北帯: 子供部屋 (全幅)
      { type: "子供部屋", floor: 3, x: 0, y: s*2, w: g, h: sn, tatami: g*sn/2 }
    ];
    return {
      id: `S_3F_${sizeM}M`,
      name: `南接道 3階建 ${sizeM}m前後`,
      floors: 3, approach: "S",
      landGridW: g, landGridH: g,
      landRangeM: landRange(sizeM),
      rooms, variableRooms: commonVR()
    };
  }

  // ---- 北接道 3階建て ----
  // 1F の玄関を北側に。LDK(2F)・寝室(3F)は南側採光を維持。
  function north3F(sizeM) {
    const g  = gridSize(sizeM);
    const s  = Math.max(2, Math.floor(g / 3));
    const sn = g - s * 2;
    const h  = Math.max(2, Math.floor(g / 4));
    const hr = g - h * 3;
    const rooms = [
      // ---- 1F ----
      // 南帯: 和室 (全幅)
      { type: "和室", floor: 1, x: 0, y: 0, w: g, h: sn, tatami: g*sn/2 },
      // 中央帯: 階段 / 廊下 / 洗面 / トイレ
      { type: "階段",  floor: 1, x: 0,    y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "廊下",  floor: 1, x: h,    y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "洗面",  floor: 1, x: h*2,  y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "トイレ",floor: 1, x: h*3,  y: sn, w: hr, h: s, tatami: hr*s/2 },
      // 北帯: 物入 / 玄関 / SC / 風呂
      { type: "物入", floor: 1, x: 0,    y: sn+s, w: h,  h: s, tatami: h*s/2 },
      { type: "玄関", floor: 1, x: h,    y: sn+s, w: h,  h: s, tatami: h*s/2 },
      { type: "SC",   floor: 1, x: h*2,  y: sn+s, w: h,  h: s, tatami: h*s/2 },
      { type: "風呂", floor: 1, x: h*3,  y: sn+s, w: hr, h: s, tatami: hr*s/2 },

      // ---- 2F ----
      // 南帯: LDK (全幅)
      { type: "LDK", floor: 2, x: 0, y: 0, w: g, h: sn, tatami: g*sn/2 },
      // 中央帯: 階段 / 廊下 / 洗面 / トイレ
      { type: "階段",  floor: 2, x: 0,    y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "廊下",  floor: 2, x: h,    y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "洗面",  floor: 2, x: h*2,  y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "トイレ",floor: 2, x: h*3,  y: sn, w: hr, h: s, tatami: hr*s/2 },
      // 北帯: WIC / 物入 / 物入
      { type: "WIC",  floor: 2, x: 0,    y: sn+s, w: h*2, h: s, tatami: h*2*s/2 },
      { type: "物入", floor: 2, x: h*2,  y: sn+s, w: h,   h: s, tatami: h*s/2 },
      { type: "物入", floor: 2, x: h*3,  y: sn+s, w: hr,  h: s, tatami: hr*s/2 },

      // ---- 3F ----
      // 南帯: 主寝室(2列幅) + 子供部屋
      { type: "寝室", role: "main", floor: 3, x: 0,    y: 0, w: h*2,    h: sn, tatami: h*2*sn/2 },
      { type: "子供部屋",           floor: 3, x: h*2,  y: 0, w: h + hr, h: sn, tatami: (h+hr)*sn/2 },
      // 中央帯: 階段 / 廊下 / トイレ / 洗面
      { type: "階段",  floor: 3, x: 0,    y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "廊下",  floor: 3, x: h,    y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "トイレ",floor: 3, x: h*2,  y: sn, w: h,  h: s, tatami: h*s/2 },
      { type: "洗面",  floor: 3, x: h*3,  y: sn, w: hr, h: s, tatami: hr*s/2 },
      // 北帯: 子供部屋 (全幅)
      { type: "子供部屋", floor: 3, x: 0, y: sn+s, w: g, h: s, tatami: g*s/2 }
    ];
    return {
      id: `N_3F_${sizeM}M`,
      name: `北接道 3階建 ${sizeM}m前後`,
      floors: 3, approach: "N",
      landGridW: g, landGridH: g,
      landRangeM: landRange(sizeM),
      rooms, variableRooms: commonVR()
    };
  }

  // ---- 東接道 3階建て(西接道は自動ミラー) ----
  // 1F の玄関を東側に。LDK は2F 西側。
  function east3F(sizeM) {
    const g  = gridSize(sizeM);
    const s  = Math.max(2, Math.floor(g / 3));   // 中央/東列の幅
    const sw = g - s * 2;                        // 西列の幅(LDK 用)
    const v  = Math.max(2, Math.floor(g / 4));   // 各行の高さ
    const vr = g - v * 3;                        // 南端余り高さ
    const rooms = [
      // ---- 1F ----
      // 西列: 和室 (全高)
      { type: "和室", floor: 1, x: 0, y: 0, w: sw, h: g, tatami: sw*g/2 },
      // 中央列: 階段 / 廊下 / 洗面 / トイレ
      { type: "階段",  floor: 1, x: sw, y: 0,    w: s, h: v,  tatami: s*v/2 },
      { type: "廊下",  floor: 1, x: sw, y: v,    w: s, h: v,  tatami: s*v/2 },
      { type: "洗面",  floor: 1, x: sw, y: v*2,  w: s, h: v,  tatami: s*v/2 },
      { type: "トイレ",floor: 1, x: sw, y: v*3,  w: s, h: vr, tatami: s*vr/2 },
      // 東列: 物入 / 玄関 / SC / 風呂
      { type: "物入", floor: 1, x: sw+s, y: 0,    w: s, h: v,  tatami: s*v/2 },
      { type: "玄関", floor: 1, x: sw+s, y: v,    w: s, h: v,  tatami: s*v/2 },
      { type: "SC",   floor: 1, x: sw+s, y: v*2,  w: s, h: v,  tatami: s*v/2 },
      { type: "風呂", floor: 1, x: sw+s, y: v*3,  w: s, h: vr, tatami: s*vr/2 },

      // ---- 2F ----
      // 西列: LDK (全高)
      { type: "LDK", floor: 2, x: 0, y: 0, w: sw, h: g, tatami: sw*g/2 },
      // 中央列: 階段 / 廊下 / 洗面 / トイレ
      { type: "階段",  floor: 2, x: sw, y: 0,    w: s, h: v,  tatami: s*v/2 },
      { type: "廊下",  floor: 2, x: sw, y: v,    w: s, h: v,  tatami: s*v/2 },
      { type: "洗面",  floor: 2, x: sw, y: v*2,  w: s, h: v,  tatami: s*v/2 },
      { type: "トイレ",floor: 2, x: sw, y: v*3,  w: s, h: vr, tatami: s*vr/2 },
      // 東列: WIC / 物入 / 物入 / 物入
      { type: "WIC",  floor: 2, x: sw+s, y: 0,    w: s, h: v,  tatami: s*v/2 },
      { type: "物入", floor: 2, x: sw+s, y: v,    w: s, h: v,  tatami: s*v/2 },
      { type: "物入", floor: 2, x: sw+s, y: v*2,  w: s, h: v,  tatami: s*v/2 },
      { type: "物入", floor: 2, x: sw+s, y: v*3,  w: s, h: vr, tatami: s*vr/2 },

      // ---- 3F ----
      // 西列: 主寝室(2行高) + 子供部屋
      { type: "寝室", role: "main", floor: 3, x: 0, y: 0,    w: sw, h: v*2,    tatami: sw*v*2/2 },
      { type: "子供部屋",           floor: 3, x: 0, y: v*2,  w: sw, h: v + vr, tatami: sw*(v+vr)/2 },
      // 中央列: 階段 / 廊下 / トイレ / 洗面
      { type: "階段",  floor: 3, x: sw, y: 0,    w: s, h: v,  tatami: s*v/2 },
      { type: "廊下",  floor: 3, x: sw, y: v,    w: s, h: v,  tatami: s*v/2 },
      { type: "トイレ",floor: 3, x: sw, y: v*2,  w: s, h: v,  tatami: s*v/2 },
      { type: "洗面",  floor: 3, x: sw, y: v*3,  w: s, h: vr, tatami: s*vr/2 },
      // 東列: 子供部屋 (全高)
      { type: "子供部屋", floor: 3, x: sw+s, y: 0, w: s, h: g, tatami: s*g/2 }
    ];
    return {
      id: `E_3F_${sizeM}M`,
      name: `東接道 3階建 ${sizeM}m前後`,
      floors: 3, approach: "E",
      landGridW: g, landGridH: g,
      landRangeM: landRange(sizeM),
      rooms, variableRooms: commonVR()
    };
  }

  // 各 window.TEMPLATES_* 配列に追加
  window.TEMPLATES_SOUTH     = window.TEMPLATES_SOUTH     || [];
  window.TEMPLATES_NORTH     = window.TEMPLATES_NORTH     || [];
  window.TEMPLATES_EAST_WEST = window.TEMPLATES_EAST_WEST || [];
  for (const s of SIZES) {
    window.TEMPLATES_SOUTH.push(south3F(s));
    window.TEMPLATES_NORTH.push(north3F(s));
    window.TEMPLATES_EAST_WEST.push(east3F(s));
  }
})();
