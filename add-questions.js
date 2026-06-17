const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf-8');

// Extract BANK manually without JSON parsing (because it has JS single quotes)
var bankStart = h.indexOf('var BANK = {');
var bankEnd = h.indexOf('// Make sure each question', bankStart);
var bankStr = h.substring(bankStart + 12, bankEnd).trim();
if (bankStr.endsWith(',')) bankStr = bankStr.substring(0, bankStr.length - 1);
if (bankStr.endsWith(';')) bankStr = bankStr.substring(0, bankStr.length - 1);

// Find the closing of each category and add questions
var cats = ['判断推理','言语理解','数量关系','资料分析','常识判断'];
var newQs = {
  '判断推理': [
    ',{q:"所有教授都是博士，有些博士不是教授。如果以上为真，以下哪项必然为真？",o:["有些博士是教授","所有博士都是教授","没有博士是教授","教授和博士没有关系"],a:0}',
    ',{q:"某公司有甲乙丙三个部门。甲部门员工数比乙多20%，丙部门比乙少25%。已知甲比丙多18人，乙有多少人？",o:["36","40","45","48"],a:1}',
    ',{q:"从所给四个选项中选出最合适的：题干图形交点数依次为1、3、5、7、？",o:["8","9","10","11"],a:1}',
    ',{q:"甲乙丙丁四人参加比赛。甲说：我不是最后一名。乙说：我不是第一名也不是最后一名。丙说：我是第一名。已知只有一人说了假话，谁是第一名？",o:["甲","乙","丙","无法确定"],a:3}',
    ',{q:"从所给选项中选出符合逻辑的：如果天下雨，那么地面湿。现在地面没湿。可以推出？",o:["天没下雨","天下雨了","地面可能湿","无法确定"],a:0}',
  ],
  '言语理解': [
    ',{q:"下列句子中，没有语病且表意明确的是：",o:["由于技术的提高，为教学提供了良好条件","大力提高工人的技术水平是迫在眉睫的大事","这家球馆可为爱好者提供球台球拍等器材","政治体制能否与经济体制相适应是能否实现和谐的关键"],a:3}',
    ',{q:"依次填入横线最恰当的：经过多年努力，我国在科技创新方面___了显著成就。这种新材料具有___的耐高温性能。",o:["取得、优异","获得、卓越","赢得、突出","达到、杰出"],a:0}',
    ',{q:"下列句子排列最恰当的是：①这不利于产业结构调整 ②且会制约经济可持续发展 ③粗放型增长虽带来短期繁荣 ④但从长远看不可持续",o:["③①④②","③④①②","④①②③","④③②①"],a:1}',
    ',{q:"人工智能正在改变世界，但改变方式并非戏剧化的，它更像潜移默化的力量，渗透到生活每个角落。这段文字主要想说明？",o:["AI是被夸大的技术","AI将戏剧性改变世界","AI在潜移默化中渗透生活","AI主要改变科幻电影"],a:2}',
  ],
  '数量关系': [
    ',{q:"某班50名学生，成绩前15%平均92分，后20%平均54分，其余平均75分。全班平均分？",o:["72.5","73.8","74.6","75.2"],a:2}',
    ',{q:"一个容器装有浓度25%的盐水若干，加入一定量水后浓度变20%；再加同样多的水，浓度变多少？",o:["15%","16%","16.67%","18%"],a:2}',
    ',{q:"甲乙从AB两地同时出发相向而行，甲速是乙的1.5倍。相遇后甲继续走完剩下路程需20分钟，乙需多少分钟？",o:["30","35","40","45"],a:3}',
    ',{q:"一个两位数，个位与十位之和为10，且个位比十位的两倍大1。这个数是？",o:["37","46","55","64"],a:0}',
    ',{q:"某商店同时卖出两件商品，每件售价60元，一件赚20%，一件亏20%。总体来看？",o:["赚5元","亏5元","不赚不亏","亏10元"],a:1}',
  ],
  '资料分析': [
    ',{q:"2021年某省第一产业2560亿元增长3.5%，第二产业7820亿增长5.2%，第三产业6810亿增长7.8%。GDP总量约？",o:["16890","17190","17560","17930"],a:1}',
    ',{q:"某市2020年粮食产量420万吨，2021年增长8%，2022年比2021年增长6.5%。2022年产量约？",o:["460","480","485","492"],a:2}',
    ',{q:"某省2020年进出口总额4800亿，出口占55%。2021年出口增12%，进口增8%，进出口总额增长率？",o:["9.8%","10.2%","10.6%","11.0%"],a:1}',
    ',{q:"2019-2022年GDP增速分别为6.1%、2.3%、8.1%、3.0%。哪年增速最快？",o:["2019","2020","2021","2022"],a:2}',
  ],
  '常识判断': [
    ',{q:"下列关于我国宪法的表述正确的是？",o:["修正案需半数以上代表通过","人大常委会有权修改宪法","国家主席有权公布法律","国务院可撤销地方政府不适当的决定"],a:3}',
    ',{q:"十四五规划提出加快数字化发展建设数字中国。哪项不属于数字经济范畴？",o:["在线教育","智慧农业","传统制造业","远程医疗"],a:2}',
    ',{q:"下列关于古代科技成就表述不正确的是？",o:["九章算术成书于东汉","张衡发明了地动仪","齐民要术是宋代农学著作","指南针在宋代用于航海"],a:2}',
    ',{q:"中国式现代化是党的二十大明确的中心任务。哪项不是其特征？",o:["人口规模巨大","全体人民同步富裕","物质和精神文明协调","人与自然和谐共生"],a:1}',
    ',{q:"战国时期百家争鸣中主张兼爱非攻的思想家是？",o:["孔子","孟子","墨子","荀子"],a:2}',
  ]
};

// Find end bracket of each category and insert new questions
for (var c of cats) {
  // Find the closing ] of this category's array
  var searchStart = bankStr.indexOf('"' + c + '":[');
  if (searchStart === -1) { console.log('Cant find: ' + c); continue; }

  // Find matching ]
  var depth = 0;
  var insertPos = -1;
  for (var i = searchStart; i < bankStr.length; i++) {
    if (bankStr[i] === '[') depth++;
    if (bankStr[i] === ']') { depth--; if (depth === 0) { insertPos = i; break; } }
  }
  if (insertPos === -1) { console.log('No closing for: ' + c); continue; }

  bankStr = bankStr.substring(0, insertPos) + newQs[c].join('') + bankStr.substring(insertPos);
  console.log('Added to ' + c + ': ' + newQs[c].length + ' questions');
}

// Rebuild the file
h = h.substring(0, bankStart + 12) + bankStr + '\n' + h.substring(bankEnd);
fs.writeFileSync('index.html', h);
console.log('Done - total questions added: ' + Object.values(newQs).reduce(function(s,a){return s+a.length},0));
