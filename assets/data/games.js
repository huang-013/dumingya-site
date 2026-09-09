/* ============================================================================
 *  游戏角色配音
 *  ----------------------------------------------------------------------------
 *  按年份分组（最新年份在前），每个游戏一个对象：
 *    { year: "2026", items: [
 *        { char: "角色名", game: "游戏名", audio: "assets/audio/xxx.mp3" }
 *      ]
 *    }
 *
 *  · char / game 是必填，audio 留空则不显示播放按钮
 *  · audio 放 assets/audio/ 下，支持 mp3 / wav / ogg
 * ============================================================================ */
window.SITE_DATA = window.SITE_DATA || {};
  window.SITE_DATA.games = [
    {
      "year": "2026",
      "items": [
        {
          "char": "迪妮莎",
          "game": "雷索纳斯",
          "audio": "assets/audio/Teresa.m4a"
        }
      ]
    },
    {
      "year": "2025",
      "items": [
        {
          "char": "杜玉白",
          "game": "无限暖暖",
          "cover": "assets/img/game-duyubai.webp",
          "audio": "assets/audio/duyubai.m4a"
        },
        {
          "char": "布丽德",
          "game": "胜利女神：新的希望",
          "cover": "assets/img/game-brid.webp",
          "audio": "assets/audio/Bready.m4a"
        }
      ]
    },
    {
      "year": "2024",
      "items": [
        {
          "char": "加拉蒂亚",
          "game": "卡拉彼丘",
          "cover": "assets/img/game-galatia.webp",
          "audio": "assets/audio/Galatea.m4a"
        }
      ]
    },
    {
      "year": "2023",
      "items": [
        {
          "char": "镜流",
          "game": "崩坏：星穹铁道",
          "cover": "assets/img/game-jingliu.webp",
          "audio": "assets/audio/jingliu.m4a"
        },
        {
          "char": "曼珠沙华 / 夹竹桃",
          "game": "圣境之塔",
          "audio": "assets/audio/manzhushahua.m4a"
        },
        {
          "char": "瑟玛",
          "game": "雾境序列",
          "cover": "assets/img/game-sema.webp",
          "audio": "assets/audio/sema.m4a"
        },
        {
          "char": "胧",
          "game": "帕尼亚战纪"
        }
      ]
    },
    {
      "year": "2022",
      "items": [
        {
          "char": "八重神子",
          "game": "原神",
          "cover": "assets/img/game-yaemiko.webp",
          "audio": "assets/audio/yae-miko.m4a"
        },
        {
          "char": "莉莉丝",
          "game": "终末阵线：伊诺贝塔",
          "audio": "assets/audio/Lilith.m4a"
        },
        {
          "char": "罗莎娜",
          "game": "欢迎来到梦乐园"
        }
      ]
    },
    {
      "year": "2021",
      "items": [
        {
          "char": "玉 / 脱解 / 德亚丝",
          "game": "复苏的魔女",
          "cover": "assets/img/game-yu.webp"
        },
        {
          "char": "千早",
          "game": "幻书启世录",
          "cover": "assets/img/game-qianzao.webp"
        },
        {
          "char": "伊鹤",
          "game": "忍者必须死3",
          "cover": "assets/img/game-yihe.webp"
        },
        {
          "char": "卡琳 / 伊芙琳",
          "game": "异界事务所"
        }
      ]
    },
    {
      "year": "2020",
      "items": [
        {
          "char": "苍玄之书 / 苍玄",
          "game": "崩坏3",
          "audio": "assets/audio/book-of-fuxi.m4a"
        },
        {
          "char": "展彦柯",
          "game": "撤回人生",
          "cover": "assets/img/game-zhanyanke.webp",
          "audio": "assets/audio/zhanyanke-chehuirensheng.m4a"
        },
        {
          "char": "法芙娜",
          "game": "幻书启世录",
          "cover": "assets/img/game-fafna.webp"
        },
        {
          "char": "凝光",
          "game": "原神",
          "cover": "assets/img/game-ningguang.webp",
          "audio": "assets/audio/ningguang.m4a"
        }
      ]
    },
    {
      "year": "2019",
      "items": [
        {
          "char": "逸仙",
          "game": "碧蓝航线",
          "cover": "assets/img/game-yixian.webp"
        },
        {
          "char": "貂蝉 / 大乔",
          "game": "少年三国志2",
          "cover": "assets/img/game-daqiao.webp"
        }
      ]
    },
    {
      "year": "2018",
      "items": [
        {
          "char": "迪妮莎",
          "game": "机动战队"
        },
        {
          "char": "瓦妮亚",
          "game": "虚荣"
        },
        {
          "char": "文姜",
          "game": "幽林怪谈"
        }
      ]
    },
    {
      "year": "2017",
      "items": [
        {
          "char": "安娜贝尔 / 芳川音羽",
          "game": "诺亚幻想",
          "cover": "assets/img/game-fangchuanyinyu.webp"
        }
      ]
    },
    {
      "year": "2016",
      "items": [
        {
          "char": "八重樱 / 八重霞",
          "game": "崩坏3",
          "cover": "assets/img/game-yaesakura.webp",
          "audio": "assets/audio/yae-sakura.m4a"
        },
        {
          "char": "艾丽莎",
          "game": "洛奇英雄传"
        }
      ]
    },
    {
      "year": "待定",
      "items": [
        {
          "char": "阮归云",
          "game": "剑网3"
        },
        {
          "char": "紫芸",
          "game": "逆光潜入"
        },
        {
          "char": "卡珊德拉",
          "game": "铃兰之剑"
        }
      ]
    }
  ];
