/* ============================================================================
 *  profile · 首屏本人资料 / 代表角色 / 照片集
 *  ----------------------------------------------------------------------------
 *  【本人资料 profile】
 *    name        姓名（必填）
 *    subtitle    副标题
 *    cover       左侧大立绘(竖版 4:5)，不填则用 gallery[0]
 *    bg          背景场景虚化图(横版 16:9)
 *    title       称号 / 身份
 *    bio         个人简介文案
 *    voice       自我介绍音频路径(assets/audio/xxx.mp3)
 *    birthday    生日 "11.15"
 *    constellation 星座 "天蝎座"
 *    company     所属公司 "奇响天外"
 *
 *  【代表角色 signatureRoles】
 *    首屏下方四张卡片（建议 4-5 个角色）：
 *      name       角色名（必填）
 *      game       所属作品
 *      title      称号
 *      cover      角色立绘(竖版 4:5)
 *      avatar     切换条小头像(正方形)
 *      bg         背景场景虚化图(横版 16:9)
 *      desc       简介文案
 *      voice      声线音频路径（留空则按钮禁用）
 *      voiceLabel 台词文案
 *
 *  【照片集 gallery】
 *    本人页 fallback 图片列表，3 张为佳。
 *      { src: "assets/img/xxx.webp", alt: "图片说明" }
 * ============================================================================ */
window.SITE_DATA = window.SITE_DATA || {};
  window.SITE_DATA.profile = {
    "name": "杜冥鸦",
    "subtitle": "配音演员 · 声音艺术家",
    "cover": "assets/img/img-02.webp",      // 左侧大立绘(竖版 4:5)
    "bg": "assets/img/cover.webp",          // 背景场景虚化图(横版 16:9)
    "voiceLabel": "「✨去做四季的风✨」",
    "title": "奇响天外 · 配音演员 / 配音导演 / 策划",
    "bio": "2005年开启配音生涯，音色清冷，有独特的个人风格。擅长驾驭多种类型的角色，从清冷御姐到灵动少女皆能信手拈来。",
    "voice": "assets/audio/qxtw-dmy.m4a",
//    "nicknames": "杜老师、杜华强、杜百万、杜怼怼",
    "birthday": "11.15",
    "constellation": "天蝎座",
    "company": "奇响天外"
  };

  window.SITE_DATA.gallery = [
    {
      "src": "assets/img/img-01.webp",
      "caption": ""
    },
    {
      "src": "assets/img/img-02.webp",
      "caption": ""
    },
    {
      "src": "assets/img/img-03.webp",
      "caption": ""
    }
  ];

  window.SITE_DATA.signatureRoles = [
    {
      "name": "八重樱",
      "game": "崩坏3",
      "title": "八重神社 · 巫女",
      "cover": "assets/img/role-yaezakura.webp",
      "avatar": "assets/img/avatar-yaezakura.webp",
      "bg": "assets/img/game-yaesakura.webp",
      "desc": "八重神社的巫女，温柔而坚韧的少女。为守护重要之人，甘愿背负起沉重的一切。",
      "voice": "assets/audio/yae-sakura.m4a",
      "voiceLabel": "「舰长补给全保底，舰长副本零掉落。」"
    },
    {
      "name": "凝光",
      "game": "原神",
      "title": "璃月七星 · 天权星",
      "cover": "assets/img/role-ningguang.webp",
      "avatar": "assets/img/avatar-ningguang.webp",
      "bg": "assets/img/game-ningguang.webp",
      "desc": "坐拥空中宫殿，有着大量传言的璃月权贵，脸上总是挂着优雅神秘的笑容。作为「璃月七星」中的天权星，她不仅象征着权力与律法，也代表着财富与才智。",
      "voice": "assets/audio/ningguang.m4a",
      "voiceLabel": "「大不了，我可以再砸一个群玉阁。」"
    },
    {
      "name": "八重神子",
      "game": "原神",
      "title": "鸣神大社 · 宫司",
      "cover": "assets/img/role-yaemiko.webp",
      "avatar": "assets/img/avatar-yaemiko.webp",
      "bg": "assets/img/game-yaemiko.webp",
      "desc": "掌管鸣神大社的大巫女、「永恒」的眷属与友人，以及，轻小说出版社「八重堂」的恐怖总编...有着多重身份的神秘宫司，凡人们或许永远无法了解她的真面目与真心。",
      "voice": "assets/audio/yae-miko.m4a",
      "voiceLabel": "「又哭又闹，呜呜呜呜，好可怜啊。」"
    },
    {
      "name": "镜流",
      "game": "崩坏：星穹铁道",
      "title": "仙舟曜青 · 云骑将军",
      "cover": "assets/img/role-jingliu.webp",
      "avatar": "assets/img/avatar-jingliu.webp",
      "bg": "assets/img/game-jingliu.webp",
      "desc": "徘徊于魔阴边缘的昔日剑首，以执念为刃的孤傲行者。斩断过往的羁绊，只为在无尽的寒霜中，寻得那斩碎神明的一瞬。",
      "voice": "assets/audio/jingliu.m4a",
      "voiceLabel": "「就让这一轮月华，照彻万川。」"
    },
    {
      "name": "林厌",
      "game": "我亲爱的法医小姐",
      "title": "清冷锋利，为最爱的人",
      "cover": "assets/img/role-linyan.webp",
      "avatar": "assets/img/avatar-linyan.webp",
      "bg": "assets/img/game-linyan.webp",
      "desc": "市局法医科主检法医师，性格清冷孤高，业务能力顶尖。世人眼中难以接近，却愿为最爱的人卸下所有锋芒。",
      "voice": "assets/audio/dramas-林厌1.m4a",
      "voiceLabel": "「法医，林厌。」"
    }
  ];
