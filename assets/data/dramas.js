/* ============================================================================
 *  商业广播剧
 *  ----------------------------------------------------------------------------
 *  按官宣年份倒序分组（最新在前）：
 *    { year: "2024", items: [
 *        { title: "剧名", season: "第一季", role: "角色名",
 *          castType: "主役/协役/客串/报幕",
 *          platform: "饭角/漫播/听姬/猫耳",
 *          announceDate: "2024.06.01", endDate: "2024.08.01" 或 "连载中",
 *          cover: "assets/img/xxx.webp",  // 选填
 *          audio: "assets/audio/xxx.mp3", // 选填
 *          link: "https://..."             // 选填，填了就整张卡片可点击跳转
 *        }
 *      ]
 *    }
 *
 *  · castType 决定标签颜色：主役(粉) / 协役(蓝) / 客串(金) / 报幕
 *  · endDate 填 "连载中" 自动打绿色「连载中」标签
 *  · link 留空或删掉则卡片不可点击
 * ============================================================================ */
window.SITE_DATA = window.SITE_DATA || {};
  window.SITE_DATA.dramas = [
    {
      "year": "2026",
      "items": [
        {
          "title": "侧写师小姐",
          "season": "全一季",
          "role": "柳回笙",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2026.03.20",
          "endDate": "2026.08.05",
          "link": "https://s.rela.me/c/1SqTNu?album_id=111554",
          "cover": "assets/img/dramas-侧写师.webp" ,
          "audio": "assets/audio/dramas-柳回笙.m4a"
        },
        {
          "title": "西东",
          "season": "第二季",
          "role": "施瑛",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2026.06.01",
          "endDate": "2026.08.20",
          "cover": "assets/img/dramas-西东第二季.webp" ,
          "audio": "assets/audio/dramas-施瑛第二季.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=5aEc2xn-qMesWsD51gDhK6vOh0-wUsycgc5Tt_6Jd1_kKSZJUVaiSy1azEBXma928ZUVjfnNjGebwFeBfaNA-sy-6asg_hu_H6xs9zKhpSc="
        },
        {
          "title": "招惹疯美人的下场",
          "season": "全一季",
          "role": "霍君娴",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2026.06.21",
          "endDate": "连载中",
          "link": "https://s.rela.me/c/1SqTNu?album_id=111660",
          "cover": "assets/img/dramas-疯美人.webp" ,
          "audio": "assets/audio/dramas-霍君娴.m4a"
        }
      ]
    },
    {
      "year": "2025",
      "items": [
        {
          "title": "我系统，我老婆凤傲天",
          "season": "全一季",
          "role": "凤诀",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2025.03.16",
          "endDate": "2025.08.28",
          "cover": "assets/img/dramas-系统.webp" ,
          "audio": "assets/audio/dramas-宫主凤诀！.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=110928"
        },
        {
          "title": "沪夏往事",
          "season": "全一季",
          "role": "谢婉君",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2025.04.07",
          "endDate": "2025.06.18",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=w-hhnmtSQLAAyBNr23yqTsmjRUaQHxhHJqQGo6K1i27J6xktVX8K0X7Hy5dAsjU08D8BRhbvez6975lRF5lMtiuJFr1n6WKsVRSP3vfalBY=",
          "cover": "assets/img/dramas-沪夏往事.webp" ,
          "audio": "assets/audio/dramas-谢婉君.m4a"
        },
        {
          "title": "病美人师尊的千层套路",
          "season": "第三季",
          "role": "云舒尘",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2025.12.05",
          "endDate": "2026.03.05",
          "cover": "assets/img/dramas-病美人第三季.webp" ,
          "audio": "assets/audio/dramas-云舒尘第三季.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=mL2fkTpQEMjoF2MNWADgdBlvqIc9GcwOhNBohkP0VhDsiEti5WJDA3o3GVpy-MtGUusJuSg7tw-k3RRKnzFOwcEBaV5fDPoA6aEA5clvKGo="
        },
        {
          "title": "复原",
          "season": "全一季",
          "role": "林漫歌",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2025.12.31",
          "endDate": "2026.03.24",
          "cover": "assets/img/dramas-复原.webp" ,
          "audio": "assets/audio/dramas-主播林漫歌.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=111458"
        }
      ]
    },
    {
      "year": "2024",
      "items": [
        {
          "title": "后来",
          "season": "全一季",
          "role": "寒霜雪 / 楼云溪",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2024.01.01",
          "endDate": "2024.04.05",
          "cover": "assets/img/dramas-后来.webp" ,
          "audio": "assets/audio/dramas-寒霜雪.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=107966"
        },
        {
          "title": "病美人师尊的千层套路",
          "season": "第一季",
          "role": "云舒尘",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2024.01.11",
          "endDate": "2024.04.14",
          "cover": "assets/img/dramas-病美人第一季.webp" ,
          "audio": "assets/audio/dramas-云舒尘第一季.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=bxUwXn6dHt3vJOqFqcnLx9F9-SnOI5XeV1W9ZlySIeaGolFwp57U6Cq1IdI817mzdC30VL93tXhWg6Ft1ESTQ7wIGgbKlNOFozwhPvrY55U="
        },
        {
          "title": "我与无限世界的反派结婚了",
          "season": "全一季",
          "role": "苏知槿",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2024.02.13",
          "endDate": "2024.05.15",
          "cover": "assets/img/dramas-无限世界.webp" ,
          "audio": "assets/audio/dramas-无限世界.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=QryjLtnfixJ70tSWjMCR7bhX69nfMTYvCVMUW5VfztYQaHoUIeGFbqoY-f7ccGiHZXoSIGMLBnvTOKPxglcu51t7jPjryajM8S3WgzqluCY="
        },
        {
          "title": "两面情人",
          "season": "第二季",
          "role": "孟栩然",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2024.04.25",
          "endDate": "2024.08.21",
          "cover": "assets/img/dramas-两面情人第二季.webp" ,
          "audio": "assets/audio/dramas-两面情人第二季预告.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=109055"
        },
        {
          "title": "合久不分",
          "season": "第一季",
          "role": "顾可馨",
          "castType": "客串",
          "platform": "饭角",
          "announceDate": "2024.06.16",
          "endDate": "2024.09.06",
          "cover": "assets/img/dramas-合久不分.webp" ,
          "audio": "assets/audio/dramas-合久不分.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=109561"
        },
        {
          "title": "西东",
          "season": "第一季",
          "role": "施瑛",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2024.07.13",
          "endDate": "2024.11.15",
          "cover": "assets/img/dramas-西东第一季.webp" ,
          "audio": "assets/audio/dramas-施瑛第一季.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=0PBtr2EcONJxdfDMKLeauBPEDM8Pl2ujC05YXwkkwcLKbxnqWchbJQIEpsHJmytd9HaSWwvioafoDmWR8CsfTAlYH3JJ54KXunPP9RxhsKs="
        },
        {
          "title": "众里寻她",
          "season": "全一季",
          "role": "胡悦",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2024.07.26",
          "endDate": "2024.11.01",
          "cover": "assets/img/dramas-众里寻她.webp" ,
          "audio": "assets/audio/dramas-众里寻她预告.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=d6oWfJoOFy_N39A3BDKX4zC6YFGIjO4ntw5b1OBLSP8Sb1P5oPNqowOIp2PTA5xj9YRuNGxPXplQ2QVPGq3noJqE7Iw5P6-8C37rLcMQtIE="
        },
        {
          "title": "病美人师尊的千层套路",
          "season": "第二季",
          "role": "云舒尘",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2024.11.15",
          "cover": "assets/img/dramas-病美人第二季.webp" ,
          "audio": "assets/audio/dramas-云舒尘第二季.m4a",
          "endDate": "2025.02.28",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=tlMdm2XCii501qzaFO0GYxbM3xIUMLxGU2inpFsiI96O24WVkDciES-LPSKh_UEdfMUPLCNdTp_p9YwL085TMyIwPQMZcA-v9laE0fGq6h8="
        }
      ]
    },
    {
      "year": "2023",
      "items": [
        {
          "title": "请嗑我和总监的CP",
          "season": "第二季",
          "role": "沈柠若",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2023.02.26",
          "endDate": "2023.07.26",
          "cover": "assets/img/dramas-总监2.webp" ,
          "audio": "assets/audio/dramas-沈柠若2.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=104853"
        },
        {
          "title": "你与爱至上",
          "season": "全一季",
          "role": "萧以歌",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2023.06.15",
          "endDate": "2023.11.23",
          "cover": "assets/img/dramas-你与爱至上.webp" ,
          "audio": "assets/audio/dramas-萧以歌.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=gFY3beiQ8bxEdFSJ498H3VSRybijR8fEMAcO_yPHgll4pct4ZS8qgxkPOk29h1A7T7eXJtGclR7lSqu2xJhKs-IvhuOGgBUDeoe6uZ7BiOU="
        },
        {
          "title": "有毒",
          "season": "全一季",
          "role": "严笑 / 六耳猕笑",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2023.07.28",
          "endDate": "2024.02.10",
          "cover": "assets/img/dramas-有毒.webp" ,
          "audio": "assets/audio/dramas-严笑.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=106327"
        },
        {
          "title": "唐小姐的阳台",
          "season": "全一季",
          "role": "唐月楼",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2023.08.31",
          "endDate": "2023.12.10",
          "cover": "assets/img/dramas-唐小姐的阳台.webp" ,
          "audio": "assets/audio/dramas-唐月楼.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/radioplay?_specific_parameter=o9J3K_g4g5nZEiItIZqOGbt7IZI5g4-FQjgbhrMW9QnOHANwL0GYuX1KiURqmDucEWJoHw1QgO00lKUWVGX2J4qBu9n_JJ2Ma9nCvteprSk="
        },
        {
          "title": "两面情人",
          "season": "第一季",
          "role": "孟栩然",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2023.09.28",
          "endDate": "2024.02.09",
          "cover": "assets/img/dramas-两面情人第一季.webp" ,
          "audio": "assets/audio/dramas-孟栩然第一季.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=107031"
        },
        {
          "title": "我的影后绯闻CP掉马了",
          "season": "第一季",
          "role": "温瑾",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2023.12.15",
          "endDate": "2024.03.11",
          "cover": "assets/img/dramas-影后cp.webp" ,
          "audio": "assets/audio/dramas-温瑾.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/episode?id=1881952470628827183"
        }
      ]
    },
    {
      "year": "2022",
      "items": [
        {
          "title": "我亲爱的法医小姐",
          "season": "第三季",
          "role": "林厌 / 裴锦红",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2022.01.12",
          "endDate": "2022.08.12",
         "cover": "assets/img/dramas-法医3.webp" ,
          "audio": "assets/audio/dramas-林厌3.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100904"
        },
        {
          "title": "微光",
          "season": "第一季",
          "role": "顾可馨",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2022.03.07",
          "endDate": "2022.06.07",
          "cover": "assets/img/dramas-微光.webp" ,
          "audio": "assets/audio/dramas-顾可馨.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/episode?id=1650110823185514552"
        },
        {
          "title": "请嗑我和总监的CP",
          "season": "第一季",
          "role": "沈柠若",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2022.03.12",
          "endDate": "2022.11.15",
          "cover": "assets/img/dramas-总监1.webp" ,
          "audio": "assets/audio/dramas-沈柠若1.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=101465"
        },
        {
          "title": "造物的恩宠",
          "season": "第一季（旧版）",
          "role": "冉禁 / 苏小淙",
          "castType": "主役",
          "platform": "漫播",
          "announceDate": "2022.04.30",
          "endDate": "2023.06.25",
          "cover": "assets/img/dramas-造物的恩宠.webp" ,
          "audio": "assets/audio/dramas-冉禁.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/episode?id=1670105820093743120"
        },
        {
          "title": "温良",
          "season": "全一季（旧版）",
          "role": "叶非",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2022.05.20",
          "endDate": "2022.06.07",
          "cover": "assets/img/dramas-温良.webp"
        }
      ]
    },
    {
      "year": "2021",
      "items": [
        {
          "title": "我亲爱的法医小姐",
          "season": "第二季",
          "role": "林厌",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2021.02.27",
          "endDate": "2021.12.16",
         "cover": "assets/img/dramas-法医2.webp" ,
          "audio": "assets/audio/dramas-林厌2.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100070"
        },
        {
          "title": "狐媚惑主",
          "season": "全一季",
          "role": "燕珣妃",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2021.05.16",
          "endDate": "2021.11.11",
          "cover": "assets/img/dramas-狐媚惑主.webp" ,
          "audio": "assets/audio/dramas-燕珣妃.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100083"
        },
        {
          "title": "谢相",
          "season": "第一季（旧版）",
          "role": "谢漪",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2021.05.19",
          "endDate": "2022.02.15",
         "cover": "assets/img/dramas-谢相.webp" ,
          "audio": "assets/audio/dramas-谢漪.m4a",
          "link": "https://manbo.kilaaudio.com/Activecard/episode?id=1596636551909998644"
        },
        {
          "title": "蔷薇怒放",
          "season": "上季",
          "role": "赫柏",
          "castType": "主役",
          "platform": "听姬 / 漫播",
          "announceDate": "2021.08.17",
          "endDate": "2022.01.15",
          "cover": "assets/img/dramas-蔷薇怒放.webp" ,
          "audio": "assets/audio/dramas-赫柏.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100255"
        },
        {
          "title": "入迷",
          "season": "第一季",
          "role": "姚染",
          "castType": "协役",
          "platform": "饭角",
          "announceDate": "2021.10.04",
          "endDate": "2022.01.25",
          "cover": "assets/img/dramas-入迷.webp" ,
          "audio": "assets/audio/dramas-姚染.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100255"
        }
      ]
    },
    {
      "year": "2020",
      "items": [
        {
          "title": "别来有恙",
          "season": "第一季",
          "role": "木枕溪",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2020.07.12",
          "endDate": "2020.11.19",
         "cover": "assets/img/dramas-别来有恙.webp" ,
          "audio": "assets/audio/dramas-木枕溪.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100015"
        },
        {
          "title": "我亲爱的法医小姐",
          "season": "第一季",
          "role": "林厌",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2020.07.19",
          "endDate": "2021.09.21",
         "cover": "assets/img/dramas-法医1.webp" ,
          "audio": "assets/audio/dramas-林厌1.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100017&audio_id=100266"
        },
        {
          "title": "余生为期",
          "season": "第三季",
          "role": "温桐",
          "castType": "协役/报幕",
          "platform": "饭角",
          "announceDate": "2020.08.15",
          "endDate": "2021.05.29", 
         "cover": "assets/img/dramas-余生为期第三季.webp" ,
          "audio": "assets/audio/dramas-余生3温桐.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=100025"
        }
      ]
    },
    {
      "year": "2019",
      "items": [
        {
          "title": "余生为期",
          "season": "第一季",
          "role": "温桐",
          "castType": "协役/报幕",
          "platform": "饭角",
          "announceDate": "2019.06.07",
          "endDate": "2019.11.21",
          "cover": "assets/img/dramas-余生为期第一季.webp" ,
          "audio": "assets/audio/dramas-余生1报幕.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=263"
        },
        {
          "title": "长明宫纪事",
          "season": "全一季",
          "role": "李怀柔",
          "castType": "主役",
          "platform": "饭角",
          "announceDate": "2019.10.20",
          "endDate": "2019.12.19",
         "cover": "assets/img/dramas-长明宫纪事.webp" ,
         "audio": "assets/audio/dramas-李怀柔.m4a" ,
          "link": "https://s.rela.me/c/1SqTNu?album_id=346"
        },
        {
          "title": "余生为期",
          "season": "第二季",
          "role": "温桐",
          "castType": "协役/报幕",
          "platform": "饭角",
          "announceDate": "2019.11.25",
          "endDate": "2020.06.23",
          "cover": "assets/img/dramas-余生为期第二季.webp" ,
          "audio": "assets/audio/dramas-余生2.m4a",
          "link": "https://s.rela.me/c/1SqTNu?album_id=358"
        }
      ]
    }
  ];
