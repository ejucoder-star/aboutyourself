// 称骨算命数据

// 中文数字转换
function chineseToNumber(chinese: string): number {
  const map: Record<string, number> = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
  };
  return map[chinese] || 0;
}

// 将钱数转换为数值（以钱为单位）
export function parseWeight(weight: string): number {
  let total = 0;
  
  // 匹配“一两”、“二两”等
  const liangMatch = weight.match(/([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341])两/);
  if (liangMatch) {
    total += chineseToNumber(liangMatch[1]) * 10;
  }
  
  // 匹配“五钱”、“六钱”等
  const qianMatch = weight.match(/([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341])钱/);
  if (qianMatch) {
    total += chineseToNumber(qianMatch[1]);
  }
  
  return total;
}

// 数字转中文
function numberToChinese(num: number): string {
  const map = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num === 10) return '十';
  if (num < 10) return map[num];
  // 处理10以上的数字，如“十一”、“十二”等
  return '十' + map[num % 10];
}

// 将数值转换为钱数字符串（中文数字）
export function formatWeight(value: number): string {
  const liang = Math.floor(value / 10);
  const qian = value % 10;
  
  if (liang > 0 && qian > 0) {
    return `${numberToChinese(liang)}两${numberToChinese(qian)}钱`;
  } else if (liang > 0) {
    return `${numberToChinese(liang)}两`;
  } else {
    return `${numberToChinese(qian)}钱`;
  }
}

// 出生年份六十花甲称骨份量
export const yearWeights: Record<string, number> = {
  "甲子": parseWeight("一两二钱"),
  "乙丑": parseWeight("九钱"),
  "丙寅": parseWeight("六钱"),
  "丁卯": parseWeight("七钱"),
  "戊辰": parseWeight("一两二钱"),
  "己巳": parseWeight("五钱"),
  "庚午": parseWeight("九钱"),
  "辛未": parseWeight("八钱"),
  "壬申": parseWeight("七钱"),
  "癸酉": parseWeight("八钱"),
  "甲戌": parseWeight("一两五钱"),
  "乙亥": parseWeight("九钱"),
  "丙子": parseWeight("一两六钱"),
  "丁丑": parseWeight("八钱"),
  "戊寅": parseWeight("八钱"),
  "己卯": parseWeight("一两九钱"),
  "庚辰": parseWeight("一两二钱"),
  "辛巳": parseWeight("六钱"),
  "壬午": parseWeight("八钱"),
  "癸未": parseWeight("七钱"),
  "甲申": parseWeight("五钱"),
  "乙酉": parseWeight("一两五钱"),
  "丙戌": parseWeight("六钱"),
  "丁亥": parseWeight("一两六钱"),
  "戊子": parseWeight("一两五钱"),
  "己丑": parseWeight("七钱"),
  "庚寅": parseWeight("九钱"),
  "辛卯": parseWeight("一两二钱"),
  "壬辰": parseWeight("一两"),
  "癸巳": parseWeight("七钱"),
  "甲午": parseWeight("一两五钱"),
  "乙未": parseWeight("六钱"),
  "丙申": parseWeight("五钱"),
  "丁酉": parseWeight("一两四钱"),
  "戊戌": parseWeight("一两四钱"),
  "己亥": parseWeight("九钱"),
  "庚子": parseWeight("七钱"),
  "辛丑": parseWeight("七钱"),
  "壬寅": parseWeight("九钱"),
  "癸卯": parseWeight("一两二钱"),
  "甲辰": parseWeight("八钱"),
  "乙巳": parseWeight("七钱"),
  "丙午": parseWeight("一两三钱"),
  "丁未": parseWeight("五钱"),
  "戊申": parseWeight("一两四钱"),
  "己酉": parseWeight("五钱"),
  "庚戌": parseWeight("九钱"),
  "辛亥": parseWeight("一两七钱"),
  "壬子": parseWeight("五钱"),
  "癸丑": parseWeight("七钱"),
  "甲寅": parseWeight("一两二钱"),
  "乙卯": parseWeight("八钱"),
  "丙辰": parseWeight("八钱"),
  "丁巳": parseWeight("六钱"),
  "戊午": parseWeight("一两九钱"),
  "己未": parseWeight("六钱"),
  "庚申": parseWeight("八钱"),
  "辛酉": parseWeight("一两六钱"),
  "壬戌": parseWeight("一两"),
  "癸亥": parseWeight("六钱"),
};

// 出生月份称骨份量
export const monthWeights: Record<number, number> = {
  1: parseWeight("六钱"),
  2: parseWeight("七钱"),
  3: parseWeight("一两八钱"),
  4: parseWeight("九钱"),
  5: parseWeight("五钱"),
  6: parseWeight("一两六钱"),
  7: parseWeight("九钱"),
  8: parseWeight("一两五钱"),
  9: parseWeight("一两八钱"),
  10: parseWeight("八钱"),
  11: parseWeight("九钱"),
  12: parseWeight("五钱"),
};

// 出生日期称骨份量
export const dayWeights: Record<number, number> = {
  1: parseWeight("五钱"),
  2: parseWeight("一两"),
  3: parseWeight("八钱"),
  4: parseWeight("一两五钱"),
  5: parseWeight("一两六钱"),
  6: parseWeight("一两五钱"),
  7: parseWeight("八钱"),
  8: parseWeight("一两六钱"),
  9: parseWeight("八钱"),
  10: parseWeight("一两六钱"),
  11: parseWeight("九钱"),
  12: parseWeight("一两七钱"),
  13: parseWeight("八钱"),
  14: parseWeight("一两七钱"),
  15: parseWeight("一两"),
  16: parseWeight("八钱"),
  17: parseWeight("九钱"),
  18: parseWeight("一两八钱"),
  19: parseWeight("五钱"),
  20: parseWeight("一两五钱"),
  21: parseWeight("一两"),
  22: parseWeight("九钱"),
  23: parseWeight("八钱"),
  24: parseWeight("九钱"),
  25: parseWeight("一两五钱"),
  26: parseWeight("一两八钱"),
  27: parseWeight("七钱"),
  28: parseWeight("八钱"),
  29: parseWeight("一两六钱"),
  30: parseWeight("六钱"),
};

// 出生时辰称骨份量
export const hourWeights: Record<string, number> = {
  "子时": parseWeight("一两六钱"),
  "丑时": parseWeight("六钱"),
  "寅时": parseWeight("七钱"),
  "卯时": parseWeight("一两"),
  "辰时": parseWeight("九钱"),
  "巳时": parseWeight("一两六钱"),
  "午时": parseWeight("一两"),
  "未时": parseWeight("八钱"),
  "申时": parseWeight("八钱"),
  "酉时": parseWeight("九钱"),
  "戌时": parseWeight("六钱"),
  "亥时": parseWeight("六钱"),
};

// 称骨歌
export const fortuneDescriptions: Record<string, { poem: string; interpretation: string }> = {
  "二两二钱": {
    poem: "身寒骨冷苦伶仃，此命推来行乞人。\n碌碌巴巴无度日，终年打拱过平生。",
    interpretation: "此命主一生贫困，需要依靠他人救济，终身劳碌却难有所成。"
  },
  "二两三钱": {
    poem: "此命推来骨自轻，求谋作事事难成。\n妻儿兄弟应难许，别处他乡作散人。",
    interpretation: "此命主做事难成，六亲无靠，需要离乡背井才能谋生。"
  },
  "二两四钱": {
    poem: "此命推来福禄无，门庭困苦总难荣。\n六亲骨肉皆无靠，流到他乡作老翁。",
    interpretation: "此命主福禄浅薄，家境贫寒，亲人无法依靠，晚年需在异乡度过。"
  },
  "二两五钱": {
    poem: "此命推详祖业微，门庭营度似稀奇。\n六亲骨肉如冰炭，一世勤劳自把持。",
    interpretation: "此命主祖业微薄，与亲人关系疏远，需要一生勤劳才能维持生计。"
  },
  "二两六钱": {
    poem: "平生衣禄苦中求，独自营谋事不休。\n离祖出门宜早计，晚年衣禄总无忧。",
    interpretation: "此命主早年辛苦，需要独自打拼，但如果早早离开家乡发展，晚年可得安稳。"
  },
  "二两七钱": {
    poem: "一生作事少商量，难靠祖宗作主张。\n匹马单枪空做去，早年晚岁总无长。",
    interpretation: "此命主做事缺乏谋划，祖业难靠，需要独自奋斗，但早晚运势都不太顺利。"
  },
  "二两八钱": {
    poem: "一生行事似飘蓬，祖宗产业在梦中。\n若不过房改名姓，也当移徙二三通。",
    interpretation: "此命主一生漂泊不定，祖业难守，可能需要过继他人或多次迁居。"
  },
  "二两九钱": {
    poem: "初年运限未曾亨，纵有功名在后成。\n须到四旬方可立，移居改姓始为良。",
    interpretation: "此命主早年运势不佳，但中年后可有成就，四十岁后运势转好，适合迁居或改名。"
  },
  "三两": {
    poem: "劳劳碌碌苦中求，东奔西走何日休？\n若系终身勤与俭，老来稍可免忧愁。",
    interpretation: "此命主一生劳碌奔波，但如果能保持勤俭，晚年可免忧愁。"
  },
  "三两一钱": {
    poem: "忙忙碌碌苦中求，何日云开见日头？\n难得祖基家可立，中年衣食渐能周。",
    interpretation: "此命主早年辛苦，祖业难靠，但中年后衣食逐渐充足。"
  },
  "三两二钱": {
    poem: "初年运蹇事难谋，渐有财源如水流。\n到得中年衣食旺，那时名利一齐收。",
    interpretation: "此命主早年运势不佳，但中年后财源广进，名利双收。"
  },
  "三两三钱": {
    poem: "早年作事事难成，百计勤劳枉费心。\n半世自如流水去，后来运至得黄金。",
    interpretation: "此命主早年做事难成，虽然勤劳但收获不多，但中年后运势转好，可得财富。"
  },
  "三两四钱": {
    poem: "此命福气果如何？僧道门中衣禄多。\n离祖出家方为妙，终年拜佛念弥陀。",
    interpretation: "此命主适合出家修行，在宗教领域可得福禄，离开家乡发展更佳。"
  },
  "三两五钱": {
    poem: "生平福量不周全，祖业根基觉少传。\n营事生涯宜守旧，时来衣食胜从前。",
    interpretation: "此命主福气不算充足，祖业不多，但如果守成经营，运势来时可比从前更好。"
  },
  "三两六钱": {
    poem: "不须劳碌过平生，独自成家福不轻。\n早有福星常照命，任君行去百般成。",
    interpretation: "此命主不需太过劳碌，可以独立成家，有福星照耀，做事容易成功。"
  },
  "三两七钱": {
    poem: "此命般般事不成，弟兄少力自孤行。\n虽然祖业须微有，来得明时去不明。",
    interpretation: "此命主做事难成，兄弟帮助少，虽有祖业但难以持久。"
  },
  "三两八钱": {
    poem: "一身骨肉最清高，早入簧门姓氏标。\n待到年将三十六，蓝衫脱去换红袍。",
    interpretation: "此命主清高有志，适合读书入仕，三十六岁时可有功名成就。"
  },
  "三两九钱": {
    poem: "此命终身运不通，劳劳作事尽皆空。\n苦心竭力成家计，到得那时在梦中。",
    interpretation: "此命主一生运势不通，虽然努力工作但难有成就，辛苦建立的家业也难以持久。"
  },
  "四两": {
    poem: "平生衣禄是绵长，件件心中自主张。\n前面风霜多受过，后来必定享安康。",
    interpretation: "此命主衣食无忧，做事有主见，早年虽有坎坷，但晚年必定安康。"
  },
  "四两一钱": {
    poem: "此命推来自不同，为人能干异凡庸。\n中年还有逍遥福，不比前时运未通。",
    interpretation: "此命主能力出众，与众不同，中年后运势转好，可享清福。"
  },
  "四两二钱": {
    poem: "得宽怀处且宽怀，何用双眉皱不开。\n若使中年命运济，那时名利一齐来。",
    interpretation: "此命主应保持乐观心态，中年后运势转好，名利双收。"
  },
  "四两三钱": {
    poem: "为人心性最聪明，作事轩昂近贵人。\n衣禄一生天数定，不须劳碌是丰亨。",
    interpretation: "此命主聪明伶俐，做事得体，容易得到贵人相助，一生衣食无忧。"
  },
  "四两四钱": {
    poem: "万事由天莫苦求，须知福禄赖人修。\n当年财帛难如意，晚景欣然便不忧。",
    interpretation: "此命主凡事随缘，早年财运不佳，但晚年运势转好，可享清福。"
  },
  "四两五钱": {
    poem: "名利推求竟若何？前番辛苦后奔波。\n命中难养男和女，骨肉扶持也不多。",
    interpretation: "此命主追求名利辛苦，子女缘分较浅，亲人帮助不多。"
  },
  "四两六钱": {
    poem: "东西南北尽皆通，出姓移居更觉隆。\n衣禄无亏天数定，中年晚景一般同。",
    interpretation: "此命主四方皆可发展，适合迁居，衣食无忧，中晚年运势平稳。"
  },
  "四两七钱": {
    poem: "此命推求旺末年，妻荣子贵自怡然。\n平生原有滔滔福，可卜财源若水来。",
    interpretation: "此命主晚年运势旺盛，妻贤子孝，一生福气深厚，财源广进。"
  },
  "四两八钱": {
    poem: "初年运道未曾通，几许蹉跎命亦劳。\n兄弟六亲无依靠，一生事业晚来隆。",
    interpretation: "此命主早年运势不佳，亲人帮助少，但晚年事业兴旺。"
  },
  "四两九钱": {
    poem: "此命推来福不轻，自成自立显门庭。\n从来富贵人钦敬，使婢差奴过一生。",
    interpretation: "此命主福气不浅，可以自立门户，受人尊敬，一生富贵。"
  },
  "五两": {
    poem: "为利为名终日劳，中年福禄也多遭。\n老来自有财星照，不比前番目下高。",
    interpretation: "此命主为名利奔波，中年福禄增多，晚年财运亨通，比早年更好。"
  },
  "五两一钱": {
    poem: "一世荣华事事通，不须劳碌自亨通。\n弟兄叔侄皆如意，家业成时福禄宏。",
    interpretation: "此命主一生荣华，做事顺利，亲人和睦，家业兴旺，福禄深厚。"
  },
  "五两二钱": {
    poem: "一世亨通事事能，不须劳苦自然宁。\n宗族有光欣善誉，家产丰盈自称心。",
    interpretation: "此命主一生亨通，不需劳苦即可安宁，家族荣耀，家产丰厚。"
  },
  "五两三钱": {
    poem: "此格推来福泽宏，兴家立业在其中。\n一生衣食安排定，却是人间一富翁。",
    interpretation: "此命主福泽深厚，可以兴家立业，一生衣食无忧，是人间富翁。"
  },
  "五两四钱": {
    poem: "此格详来福泽宏，诗书满腹看功成。\n丰衣足食多安稳，正是人间有福人。",
    interpretation: "此命主福泽深厚，饱读诗书可成功名，衣食丰足，是有福之人。"
  },
  "五两五钱": {
    poem: "走马扬鞭争利名，少年作事费筹论。\n一朝福禄源源至，富贵荣华显六亲。",
    interpretation: "此命主少年时为名利奔波，但一旦福禄到来，即可富贵荣华，光耀门楣。"
  },
  "五两六钱": {
    poem: "此格推来礼义通，一身福禄用无穷。\n甜酸苦辣皆尝过，滚滚财源稳且丰。",
    interpretation: "此命主知书达理，福禄无穷，虽经历人生百味，但财源滚滚，稳定丰厚。"
  },
  "五两七钱": {
    poem: "福禄丰盈万事全，一身荣耀乐天年。\n名扬威震人争羡，处世逍遥似遇仙。",
    interpretation: "此命主福禄丰盈，万事如意，名声远扬，受人羡慕，生活逍遥自在。"
  },
  "五两八钱": {
    poem: "平生衣食自然来，名利双全富贵偕。\n金榜题名登甲第，紫袍玉带走金阶。",
    interpretation: "此命主衣食无忧，名利双全，可金榜题名，官运亨通。"
  },
  "五两九钱": {
    poem: "细推此格秀而清，必定才高学业成。\n甲第之中应有分，扬鞭走马显威荣。",
    interpretation: "此命主才华出众，学业有成，可考取功名，显赫荣耀。"
  },
  "六两": {
    poem: "一朝金榜快题名，显祖荣宗大器成。\n衣禄定然无欠缺，田园财帛更丰盈。",
    interpretation: "此命主可金榜题名，光宗耀祖，衣食无忧，田产丰厚。"
  },
  "六两一钱": {
    poem: "不作朝中金榜客，定为世上大财翁。\n聪明天付经书熟，名显高科自是荣。",
    interpretation: "此命主即使不做官，也必定是富翁，聪明过人，饱读诗书，名声显赫。"
  },
  "六两二钱": {
    poem: "此命生来福不穷，读书必定显亲荣。\n紫衣金带为卿相，富贵荣华皆可同。",
    interpretation: "此命主福气深厚，读书可光宗耀祖，可做高官，富贵荣华。"
  },
  "六两三钱": {
    poem: "命主为官福禄长，得来富贵实非常。\n名题雁塔传金榜，大显门庭天下扬。",
    interpretation: "此命主适合做官，福禄绵长，富贵非凡，金榜题名，光耀门庭。"
  },
  "六两四钱": {
    poem: "此格威权不可当，紫袍金带坐高堂。\n荣华富贵谁能及？万古留名姓氏扬。",
    interpretation: "此命主威权显赫，位高权重，荣华富贵无人能及，名垂青史。"
  },
  "六两五钱": {
    poem: "细推此命福非轻，富贵荣华孰与争？\n定国安邦人极品，威声显赫震寰瀛。",
    interpretation: "此命主福气深厚，富贵荣华无人能比，可安邦定国，威名远扬。"
  },
  "六两六钱": {
    poem: "此格人间一福人，堆金积玉满堂春。\n从来富贵由天定，金榜题名更显亲。",
    interpretation: "此命主是人间有福之人，财富丰厚，富贵天定，金榜题名更可光耀门楣。"
  },
  "六两七钱": {
    poem: "此命生来福自宏，田园家业最高隆。\n平生衣禄盈丰足，一路荣华万事通。",
    interpretation: "此命主福气宏大，家业兴旺，一生衣食丰足，荣华富贵，万事亨通。"
  },
  "六两八钱": {
    poem: "富贵由天莫苦求，万金家计不须谋。\n十年不比前番事，祖业根基千古留。",
    interpretation: "此命主富贵天定，不需苦求，家业丰厚，祖业深厚，可传千古。"
  },
  "六两九钱": {
    poem: "君是人间衣禄星，一生富贵众人钦。\n总然福禄由天定，安享荣华过一生。",
    interpretation: "此命主是人间福星，一生富贵，受人敬仰，福禄天定，安享荣华。"
  },
  "七两": {
    poem: "此命推来福不轻，何须愁虑苦劳心。\n荣华富贵已天定，正笑垂绅舞紫宸。",
    interpretation: "此命主福气深厚，不需忧虑，荣华富贵天定，可享高位。"
  },
  "七两一钱": {
    poem: "此命生成大不同，公侯卿相在其中。\n一生自有逍遥福，富贵荣华极品隆。",
    interpretation: "此命主命格非凡，可做公侯卿相，一生逍遥自在，富贵荣华达到极致。"
  },
};

// 天干地支
export const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const zodiacAnimals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

// 根据公历年份计算天干地支
export function getGanZhi(year: number): string {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return heavenlyStems[stemIndex] + earthlyBranches[branchIndex];
}

// 根据公历年份计算生肖
export function getZodiac(year: number): string {
  const branchIndex = (year - 4) % 12;
  return zodiacAnimals[branchIndex];
}

// 时辰对应表（24小时制）
export function getHourName(hour: number): string {
  const hourNames = [
    "子时", "丑时", "寅时", "卯时", "辰时", "巳时",
    "午时", "未时", "申时", "酉时", "戌时", "亥时"
  ];
  
  // 23点到1点是子时
  if (hour === 23 || hour === 0) return hourNames[0];
  
  // 其他时辰每2小时一个
  const index = Math.floor((hour + 1) / 2);
  return hourNames[index];
}

// 计算总骨重
export function calculateBoneWeight(
  year: number,
  month: number,
  day: number,
  hour: number
): { total: number; yearWeight: number; monthWeight: number; dayWeight: number; hourWeight: number; ganZhi: string; zodiac: string; hourName: string } {
  const ganZhi = getGanZhi(year);
  const zodiac = getZodiac(year);
  const hourName = getHourName(hour);
  
  const yearWeight = yearWeights[ganZhi] || 0;
  const monthWeight = monthWeights[month] || 0;
  const dayWeight = dayWeights[day] || 0;
  const hourWeight = hourWeights[hourName] || 0;
  
  const total = yearWeight + monthWeight + dayWeight + hourWeight;
  
  return {
    total,
    yearWeight,
    monthWeight,
    dayWeight,
    hourWeight,
    ganZhi,
    zodiac,
    hourName
  };
}

// 获取命运描述
export function getFortuneDescription(totalWeight: number): { poem: string; interpretation: string } | null {
  const weightStr = formatWeight(totalWeight);
  return fortuneDescriptions[weightStr] || null;
}
