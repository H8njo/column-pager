import _ from "lodash";
import { useMemo } from "react";

const data = {
  items: [
    {
      passageId: "c130f562-98d9-450c-a544-d9f6759491f1",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "4327cf7e-1aa9-4afd-9520-e36753b7295a",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">reconsider</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-324">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-325">"Oh, I\'ve reconsidered. I must positively have them here tomorrow." Five articles in a day! That meant working on them all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked nervously.<br>"No, I must have them tomorrow morning. And remember, every article must be completely accurate," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar. Staying up all night long writing articles was a small price to pay for the luxury of telling the truth directly without respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-326">아래의 사전설명에 해당하는 단어를 쓰시오.</span></div><div class="example">\n<div class="example-content" style="text-align: left"><span class="bbox-327">to think again about something in order to decide if you should change your opinion or decision</span></div>\n</div><div class="open-ended-set"> <span class="bbox-328">➝ __________________________________________________________________________</span> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--198">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400529942510",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "c130f562-98d9-450c-a544-d9f6759491f1",
        passageTitle: "본문 06",
      },
      itemTypeInfo: {
        id: "4327cf7e-1aa9-4afd-9520-e36753b7295a",
        writeLabel: null,
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193777",
        status: "completed",
      },
    },
    {
      passageId: "c130f562-98d9-450c-a544-d9f6759491f1",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "e3fa6716-7565-4c46-a85b-f6c991c9ec46",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">하룻밤을 꼬박 지새워 다섯 편의 기사 작성을 완료하는 것</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-324">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-325">"Oh, I\'ve reconsidered. I must positively have them here tomorrow." Five articles in a day! That meant working on them all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked nervously.<br>"No, I must have them tomorrow morning. And remember, every article must be completely accurate," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar. Staying up all night long writing articles was a small price to pay for the luxury of telling the truth directly without respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-329">윗글을 읽고 다음 질문에 대한 답을 우리말로 쓰시오.</span></div><div class="example">\n<div class="example-content" style="text-align: left"><span class="bbox-330">According to the passage, what\'s the price of&nbsp;Sekhar telling the truth?</span></div>\n</div><div class="open-ended-set"> <span class="bbox-331">➝ __________________________________________________________________________</span> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--200">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400529942511",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "c130f562-98d9-450c-a544-d9f6759491f1",
        passageTitle: "본문 06",
      },
      itemTypeInfo: {
        id: "e3fa6716-7565-4c46-a85b-f6c991c9ec46",
        writeLabel: null,
        editLabel: "영작/해석",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "high",
      },
      uciInfo: {
        code: "I110:A+REG-0000193778",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "f931cfa5-f986-4524-8b3f-14955e46be75",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">ⓐ the sun<br>ⓑ truth</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-273">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-274">Sekhar believed that truth is like the sun. No human being can ever look at ⓐ <span style="text-decoration: underline">it</span> directly in the face without blinking or being dazed. He thought that the essence of human relationships consisted in tempering truth so that ⓑ <span style="text-decoration: underline">it</span> might not shock anyone. So, he decided to make today unique - he had to give and take the absolute truth, whatever happened. ㉮ <span style="text-decoration: underline">Otherwise</span>, life was not worth living. The day ahead seemed full of possibilities to&nbsp;Sekhar. He told no one about his "experiment."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-275">윗글의 밑줄 친 ⓐ, ⓑ가 가리키는 것을 찾아 쓰시오.</span></div><table border="1" style="border-collapse: collapse; width: 49.9234%; height: 10px"><colgroup><col style="width: 7.40642%"><col style="width: 17.6002%"><col style="width: 7.00823%"><col style="width: 17.9984%"></colgroup> <tbody> <tr style="height: 10px"> <td style="text-align: center; line-height: 2; height: 10px">ⓐ</td> <td style="text-align: center; line-height: 2; height: 10px">____________________</td> <td style="text-align: center; line-height: 2; height: 10px">ⓑ</td> <td style="text-align: center; line-height: 2; height: 10px">____________________</td> </tr> </tbody> </table>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--164">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400513165277",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "f931cfa5-f986-4524-8b3f-14955e46be75",
        writeLabel: null,
        editLabel: "밑줄함의/지칭추론",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193761",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "8bc07677-cb7c-44c1-a601-e911d6a67f9c",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">If he didn\'t give and take</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-273">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-274">Sekhar believed that truth is like the sun. No human being can ever look at ⓐ <span style="text-decoration: underline">it</span> directly in the face without blinking or being dazed. He thought that the essence of human relationships consisted in tempering truth so that ⓑ <span style="text-decoration: underline">it</span> might not shock anyone. So, he decided to make today unique - he had to give and take the absolute truth, whatever happened. ㉮ <span style="text-decoration: underline">Otherwise</span>, life was not worth living. The day ahead seemed full of possibilities to&nbsp;Sekhar. He told no one about his "experiment."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-277">윗글의 밑줄 친 ㉮와 같은 의미가 되도록 빈칸에 알맞은 낱말을 써 넣으시오.</span></div><div class="open-ended-set"><span class="bbox-278">➝ __________ __________ __________ __________ __________ __________ the absolute truth,</span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--166">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400513165278",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "8bc07677-cb7c-44c1-a601-e911d6a67f9c",
        writeLabel: null,
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "low",
      },
      uciInfo: {
        code: "I110:A+REG-0000193762",
        status: "completed",
      },
    },
    {
      passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "f931cfa5-f986-4524-8b3f-14955e46be75",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">ⓐ those articles<br>ⓑ five articles</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-267">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-268">He received a call from the chief editor the next day. Sekhar answered with a worried voice. "Your suggestion about my music was very useful. Thank you," the chief editor said, "By the way, where are those articles?"<br>"You gave me ten days to finish ⓐ <span style="text-decoration: underline">them</span>." Sekhar responded, surprised.<br>"Oh, I\'ve reconsidered. I must positively have them here tomorrow." Five articles in a day! That meant working on ⓑ <span style="text-decoration: underline">them</span> all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked nervously.<br>"No, I must have them tomorrow morning. And remember, every article must be completely accurate," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar. Staying up all night long writing articles was a small price to pay for the luxury of telling the truth directly without respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-269">윗글의 밑줄 친 ⓐ, ⓑ가 가리키는 것을 찾아 쓰시오.</span></div><div class="open-ended-set"> <table border="1" style="border-collapse: collapse; width: 49.9234%; height: 10px"><colgroup><col style="width: 7.40642%"><col style="width: 17.6002%"><col style="width: 7.00823%"><col style="width: 17.9984%"></colgroup> <tbody> <tr style="height: 10px"> <td style="text-align: center; line-height: 2; height: 10px">ⓐ</td> <td style="text-align: center; line-height: 2; height: 10px">____________________</td> <td style="text-align: center; line-height: 2; height: 10px">ⓑ</td> <td style="text-align: center; line-height: 2; height: 10px">____________________</td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--160">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400513165275",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
        passageTitle: "본문 05",
      },
      itemTypeInfo: {
        id: "f931cfa5-f986-4524-8b3f-14955e46be75",
        writeLabel: null,
        editLabel: "밑줄함의/지칭추론",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193758",
        status: "completed",
      },
    },
    {
      passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "0adfc47d-a3a0-42a5-901b-0c179d3093f0",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">⑤</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-267">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-268">He received a call from the chief editor the next day. Sekhar answered with a worried voice. "Your suggestion about my music was very useful. Thank you," the chief editor said, "By the way, where are those articles?"<br>"You gave me ten days to finish ⓐ <span style="text-decoration: underline">them</span>." Sekhar responded, surprised.<br>"Oh, I\'ve reconsidered. I must positively have them here tomorrow." Five articles in a day! That meant working on ⓑ <span style="text-decoration: underline">them</span> all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked nervously.<br>"No, I must have them tomorrow morning. And remember, every article must be completely accurate," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar. Staying up all night long writing articles was a small price to pay for the luxury of telling the truth directly without respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-271">윗글에 드러난 \'Sekhar\'의 심경으로 가장 적절한 것은?</span></div><div class="choice-set"><span class="bbox-272">① gloomy<br>② hopeless<br>③ horrified<br>④ concerned<br>⑤ embarrassed<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--162">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400513165276",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
        passageTitle: "본문 05",
      },
      itemTypeInfo: {
        id: "0adfc47d-a3a0-42a5-901b-0c179d3093f0",
        writeLabel: null,
        editLabel: "분위기/어조/심경",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "low",
      },
      uciInfo: {
        code: "I110:A+REG-0000193760",
        status: "completed",
      },
    },
    {
      passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "4f67e4b1-ae27-4bb7-8be9-fc0f6396bbfb",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">"I wasn\'t fortunate enough to have children,"</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-166">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-167">They started going to the chief editor\'s house.&nbsp;㉮ “<span style="text-decoration: underline">난 아이들을 가질 만큼 운이 좋진 않았다네</span>,” the chief editor said sadly as they walked, "but I prayed to at least have the comfort of music in my life." He chattered endlessly about music: how he began one day out of sheer boredom; how his teacher at first laughed at him and then gave him hope; how his ambition in life was to forget himself in music.<br>At his home, ㉯ <span style="text-decoration: underline">편집장은</span><span style="text-decoration: underline">&nbsp;Sekhar에게 호화로운 소파에 앉으라고 청하고 몇 가지 맛있는 음식을 그의 앞에 놓았다</span>. He treated Sekhar like his son-in-law. He even said, "You must listen with an open mind. Don\'t worry about those articles. I will give you an extra week to write them.”<br>"Make it ten days, sir,"&nbsp;Sekhar begged.<br>"All right," the chief editor said generously.<br>The chief editor now began to sing a song and continued with two more.&nbsp;Sekhar started commenting to himself. He croaks like a dozen frogs. He bellows like a buffalo. Now he sounds like old window screens in a storm.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-168">윗글의 밑줄 친 우리말 ㉮를 [보기]의 단어를 <span style="text-decoration: underline">모두</span> 이용하여 어법에 맞는 문장으로 완성하시오.</span></div><div class="example">\n<div class="example-content"><span class="bbox-169">[보기]<br><br>enough / to / I / wasn\'t / fortunate / have / children</span></div>\n</div><div class="open-ended-set"><span class="bbox-170">➝ __________________________________________________________________________</span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--96">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400487999419",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
        passageTitle: "본문 04",
      },
      itemTypeInfo: {
        id: "4f67e4b1-ae27-4bb7-8be9-fc0f6396bbfb",
        writeLabel: null,
        editLabel: "영작/해석",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "high",
      },
      uciInfo: {
        code: "I110:A+REG-0000193728",
        status: "completed",
      },
    },
    {
      passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "49a65819-0f27-4c13-9462-9d326039ced1",
      answerAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="answer">the chief editor invited Sekhar to sit on a luxurious couch and put several delicious dishes before him.</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-166">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-167">They started going to the chief editor\'s house.&nbsp;㉮ “<span style="text-decoration: underline">난 아이들을 가질 만큼 운이 좋진 않았다네</span>,” the chief editor said sadly as they walked, "but I prayed to at least have the comfort of music in my life." He chattered endlessly about music: how he began one day out of sheer boredom; how his teacher at first laughed at him and then gave him hope; how his ambition in life was to forget himself in music.<br>At his home, ㉯ <span style="text-decoration: underline">편집장은</span><span style="text-decoration: underline">&nbsp;Sekhar에게 호화로운 소파에 앉으라고 청하고 몇 가지 맛있는 음식을 그의 앞에 놓았다</span>. He treated Sekhar like his son-in-law. He even said, "You must listen with an open mind. Don\'t worry about those articles. I will give you an extra week to write them.”<br>"Make it ten days, sir,"&nbsp;Sekhar begged.<br>"All right," the chief editor said generously.<br>The chief editor now began to sing a song and continued with two more.&nbsp;Sekhar started commenting to himself. He croaks like a dozen frogs. He bellows like a buffalo. Now he sounds like old window screens in a storm.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-171">윗글의 밑줄 친 우리말 ㉯를 다음의 조건에 따라 쓰시오.</span></div><div class="condition">\n<div class="condition-header"><span>&lt;조건&gt;</span></div>\n<div class="condition-content"><span class="bbox-172">• 보기의 단어를 이용해서 문장을 완성할 것.<br>• 필요하다면 단어의 형태를 변형 시킬 것.<br>• invite+목적어+목적격보어의 형태에 이어서 동사를 병렬 연결할 것.(전체 <span style="text-decoration: underline">18개</span>의 낱말을 사용할 것)</span><span></span></div>\n</div><div class="example">\n<div class="example-header"><span>&lt;보기&gt;</span></div>\n<div class="example-content"><span class="bbox-173">chief editor / luxurious / delicious / dishes / several / put / couch</span></div>\n</div><div class="open-ended-set"> <span class="bbox-174">➝ __________________________________________________________________________</span> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--98">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400487999420",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
        passageTitle: "본문 04",
      },
      itemTypeInfo: {
        id: "49a65819-0f27-4c13-9462-9d326039ced1",
        writeLabel: null,
        editLabel: "영작/해석",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193729",
        status: "completed",
      },
    },
    {
      passageId: "59da5e40-693a-48eb-8cda-ac5652b4842f",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "49a65819-0f27-4c13-9462-9d326039ced1",
      answerAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="answer">Sekhar thought to himself that it must be about the horrible feature articles that he had to write.</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-201">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-202">During lunch time, Sekhar received a note from the chief editor: "Please see me before you go home." ㉮&nbsp;<span style="text-decoration: underline">Sekhar는 그것이 그가 써야 했던 끔찍한 특집 기사들에 관한 것임에 틀림이 없다고 스스로 생각했다</span>. He hadn\'t completed five articles that were due soon. He had avoided the work for weeks, which put him under great pressure.<br>He entered the chief editor\'s room with a very polite "Good evening, sir.”<br>The chief editor looked up at him in a very friendly manner and asked, "Are you free this evening?”<br>"Yes, pretty much. Do you need me for anything, sir?" asked&nbsp;Sekhar.<br>"Yes," replied the chief editor, smiling to himself. "You didn\'t know about my interest in music, did you? I\'ve been learning and practicing secretly, and now I want you to hear me this evening. I want your opinion. I know it will be valuable.”<br>Sekhar\'s opinions about music were well-known. He was one of the most serious music critics in the town. But he never thought that his interest in music would lead him into this kind of situation.<br>"It\'s rather a surprise for you, isn\'t it?" asked the chief editor.<br>㉯ "<span style="text-decoration: underline">나는 공부에 꽤 많은 돈을 써 왔다</span>&nbsp; and I\'ve kept it a secret.”</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-203">윗글의 밑줄 친 우리말 ㉮를 다음의 조건에 따라 쓰시오.</span></div><div class="condition">\n<div class="condition-header"><span>&lt;조건&gt;</span></div>\n<div class="condition-content"><span class="bbox-204">• 보기의 단어를 이용해서 문장을 완성할 것.<br>• 필요하다면 단어의 형태를 변형 시킬 것.<br>• that을 명사절과 관계대명사로 각각 한 번씩 이용하고, 전체 <span style="text-decoration: underline">18</span><span style="text-decoration: underline">개</span>의 낱말로 영작할 것.</span><span></span></div>\n</div><div class="example">\n<div class="example-header"><span>&lt;보기&gt;</span></div>\n<div class="example-content"><span class="bbox-205">think / must / horrible / feature / write / articles / have to / oneself</span></div>\n</div><div class="open-ended-set"><span class="bbox-206">➝ __________________________________________________________________________</span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--118">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400496388038",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "59da5e40-693a-48eb-8cda-ac5652b4842f",
        passageTitle: "본문 03",
      },
      itemTypeInfo: {
        id: "49a65819-0f27-4c13-9462-9d326039ced1",
        writeLabel: null,
        editLabel: "영작/해석",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193739",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "4f67e4b1-ae27-4bb7-8be9-fc0f6396bbfb",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">I\'ve spent so much money on learning</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-201">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-202">During lunch time, Sekhar received a note from the chief editor: "Please see me before you go home." ㉮&nbsp;<span style="text-decoration: underline">Sekhar는 그것이 그가 써야 했던 끔찍한 특집 기사들에 관한 것임에 틀림이 없다고 스스로 생각했다</span>. He hadn\'t completed five articles that were due soon. He had avoided the work for weeks, which put him under great pressure.<br>He entered the chief editor\'s room with a very polite "Good evening, sir.”<br>The chief editor looked up at him in a very friendly manner and asked, "Are you free this evening?”<br>"Yes, pretty much. Do you need me for anything, sir?" asked&nbsp;Sekhar.<br>"Yes," replied the chief editor, smiling to himself. "You didn\'t know about my interest in music, did you? I\'ve been learning and practicing secretly, and now I want you to hear me this evening. I want your opinion. I know it will be valuable.”<br>Sekhar\'s opinions about music were well-known. He was one of the most serious music critics in the town. But he never thought that his interest in music would lead him into this kind of situation.<br>"It\'s rather a surprise for you, isn\'t it?" asked the chief editor.<br>㉯ "<span style="text-decoration: underline">나는 공부에 꽤 많은 돈을 써 왔다</span>&nbsp; and I\'ve kept it a secret.”</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-207">윗글의 밑줄 친 우리말 ㉯를 [보기]의 단어를 <span style="text-decoration: underline">모두</span> 이용하여 어법에 맞는 문장으로 완성하시오.(두 개의 낱말은 변형하여 사용할 것)</span></div><div class="example">\n<div class="example-content"><span class="bbox-208">[보기]<br><br>much / I\'ve / learn / spend / money / on / so</span></div>\n</div><div class="open-ended-set"> <span class="bbox-209">➝ __________________________________________________________________________</span> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--120">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400496388039",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "4f67e4b1-ae27-4bb7-8be9-fc0f6396bbfb",
        writeLabel: null,
        editLabel: "영작/해석",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "high",
      },
      uciInfo: {
        code: "I110:A+REG-0000193740",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "30387ccd-7601-4353-afe6-dd906a88218d",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">⑤</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-102">다음 글을 읽고 물음에 답하시오.</span></div><div class="example">\n<div class="example-content" style="text-align: left"><span class="bbox-103">The very first test came when his wife served him his morning meal. He hesitated over the dish, which she thought was her best cooking. She asked, "Why, isn\'t it good?" At other times, he would have considered her feelings and said, "I feel full, that\'s all."</span></div>\n</div><div class="contents passage" style="text-align: justify;"><span class="bbox-104">(A) "He was such a fine man.... " The other coworker began to say. But Sekhar ⓐ <strong>[ interrupted / interpret ]</strong> him and said, "I don\'t think so. He always treated me poorly."</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-105">(B) But today he said, "It isn\'t good. I can\'t ⓑ <strong>[ shallow /&nbsp; swallow ]</strong> it." He saw her wince and said to himself, "It can\'t be helped. Truth is like the sun.”</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-106">(C) His next trial was at his office when one of his coworkers came up to him and said, "Did you hear the news? John got fired without notice. Don\'t you think it\'s ⓒ <strong>[ terrific / terrible ]</strong>?""No," Sekhar answered.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-107">주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시 오.</span></div><div class="choice-set"> <table border="1" class="bbox-108" style="border-collapse: collapse; width: 100%; height: 67.1952px"><colgroup><col style="width: 50%"><col style="width: 50%"></colgroup> <tbody> <tr style="height: 22.3984px"> <td style="height: 22.3984px">① (A) - (B) - (C)</td> <td style="height: 22.3984px">② (B) - (A) - (C)</td> </tr> <tr style="height: 22.3984px"> <td style="height: 22.3984px">③ (C) - (A) - (B)</td> <td style="height: 22.3984px">④ (C) - (B) - (A)</td> </tr> <tr style="height: 22.3984px"> <td style="height: 22.3984px">⑤ (B) - (C) - (A)</td> <td style="height: 22.3984px"></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--66">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400471222188",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "30387ccd-7601-4353-afe6-dd906a88218d",
        writeLabel: null,
        editLabel: "순서/연결어",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193711",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "35250514-f48f-46c0-bc4a-700ff9124426",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">③</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-102">다음 글을 읽고 물음에 답하시오.</span></div><div class="example">\n<div class="example-content" style="text-align: left"><span class="bbox-103">The very first test came when his wife served him his morning meal. He hesitated over the dish, which she thought was her best cooking. She asked, "Why, isn\'t it good?" At other times, he would have considered her feelings and said, "I feel full, that\'s all."</span></div>\n</div><div class="contents passage" style="text-align: justify;"><span class="bbox-104">(A) "He was such a fine man.... " The other coworker began to say. But Sekhar ⓐ <strong>[ interrupted / interpret ]</strong> him and said, "I don\'t think so. He always treated me poorly."</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-105">(B) But today he said, "It isn\'t good. I can\'t ⓑ <strong>[ shallow /&nbsp; swallow ]</strong> it." He saw her wince and said to himself, "It can\'t be helped. Truth is like the sun.”</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-106">(C) His next trial was at his office when one of his coworkers came up to him and said, "Did you hear the news? John got fired without notice. Don\'t you think it\'s ⓒ <strong>[ terrific / terrible ]</strong>?""No," Sekhar answered.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-109">윗글 (ⓐ), (ⓑ), (ⓒ)의 각 괄호 안에서 문맥에 맞는 낱말로 가장 적절한 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-110" style="border-collapse: collapse; width: 100%; height: 124.781px"><colgroup><col style="width: 7.01224%"><col style="width: 30.3834%"><col style="width: 31.7195%"><col style="width: 30.8848%"></colgroup> <tbody> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px"></td> <td style="text-align: center; height: 20.7969px">(ⓐ)</td> <td style="text-align: center; height: 20.7969px">(ⓑ)</td> <td style="text-align: center; height: 20.7969px">(ⓒ)</td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">①</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">interpreted </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">swallow </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">terrific </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">②</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">interpreted </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">shallow </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">terrible </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">③</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">interpreted </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">swallow </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">terrible </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">④</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">interrupted </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">shallow </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">terrific </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">⑤</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">interrupted </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">shallow </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-110">terrible </span></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--68">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400479610797",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "35250514-f48f-46c0-bc4a-700ff9124426",
        writeLabel: "어휘 (선택)",
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "low",
      },
      uciInfo: {
        code: "I110:A+REG-0000193713",
        status: "completed",
      },
    },
    {
      passageId: "c130f562-98d9-450c-a544-d9f6759491f1",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">⑤</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-138">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-139">"Oh, I\'ve reconsidered. I must ⓐ <span style="text-decoration: underline">positively</span> have them here tomorrow." Five articles in a day! That meant working on them all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked ⓑ <span style="text-decoration: underline">nervously</span>.<br>"No, I must have them tomorrow morning. And remember, every article must be completely&nbsp;ⓒ <span style="text-decoration: underline">accurate</span>," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar.&nbsp;ⓓ <span style="text-decoration: underline">Staying up</span>&nbsp;all night long writing articles was a small price to pay for the luxury of telling the truth directly&nbsp;ⓔ <span style="text-decoration: underline">with</span>&nbsp;respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-140">윗글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <span style="text-decoration: underline">않은</span> 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-141" style="border-collapse: collapse; width: 100%"><colgroup><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"></colgroup> <tbody> <tr> <td>① ⓐ</td> <td>② ⓑ</td> <td>③ ⓒ</td> <td>④ ⓓ</td> <td>⑤ ⓔ</td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--82">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400479610804",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "c130f562-98d9-450c-a544-d9f6759491f1",
        passageTitle: "본문 06",
      },
      itemTypeInfo: {
        id: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
        writeLabel: "어휘 (밑줄)",
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193720",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "essay",
      isHtmlData: true,
      itemTypeId: "4f67e4b1-ae27-4bb7-8be9-fc0f6396bbfb",
      answerAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="answer">No human being can ever look at it directly in the face without blinking or being dazed.</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-222">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-223">Sekhar believed that truth is like the sun. ㉮ <span style="text-decoration: underline">어떤 인간도 눈을 깜박이거나 아찔해지지 않고서는 그것을 얼굴로 똑바로 쳐다볼 수 없다</span>. He thought that the essence of human relationships consisted in tempering truth so that it might not shock anyone. So, he decided to make today unique - he had to give and take the absolute truth, whatever happened. Otherwise, life was not worth living. The day ahead seemed full of possibilities to Sekhar. He told no one about his "experiment."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-224">윗글의 밑줄 친 우리말 ㉮를 [보기]의 단어를 <span style="text-decoration: underline">모두</span> 이용하여 어법에 맞는 문장으로 완성하시오.(두 개의 낱말은 추가하여 사용할 것)</span></div><div class="example">\n<div class="example-content"><span class="bbox-225">[보기]<br><br>look / it / in / human being / the / can / ever / face / without / look / blinking / at / or / directly</span></div>\n</div><div class="open-ended-set"> <span class="bbox-226">➝ __________________________________________________________________________</span> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--130">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400504776652",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "4f67e4b1-ae27-4bb7-8be9-fc0f6396bbfb",
        writeLabel: null,
        editLabel: "영작/해석",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193745",
        status: "completed",
      },
    },
    {
      passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "c7ead996-33ab-4138-8250-9e221816deda",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">①</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-30">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-31">He received a call from the chief editor the next day. Sekhar answered with a worried voice. "Your suggestion about my music was very useful. Thank you," the chief editor said, "By the way, where are those articles?"<br>"You gave me ten days to finish them."&nbsp;Sekhar responded, (A) <strong>[ surprising / surprised ]</strong>.<br>"Oh, I\'ve reconsidered. I must positively have them here tomorrow." Five articles in a day! That meant (B) <strong>[ to work / working ]</strong> on them all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked nervously.<br>"No, I must have them tomorrow morning. And remember, every article must be completely accurate," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar. Staying up all night long writing articles (C) <strong>[ was / were ]</strong> a small price to pay for the luxury of telling the truth directly without respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-32">윗글 (A), (B), (C)의 각 괄호 안에서 어법상 맞는 표현으로 가장 적절한 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-33" style="border-collapse: collapse; width: 100%; height: 124.781px"><colgroup><col style="width: 7.01224%"><col style="width: 30.3834%"><col style="width: 31.7195%"><col style="width: 30.8848%"></colgroup> <tbody> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px"></td> <td style="text-align: center; height: 20.7969px">(A)</td> <td style="text-align: center; height: 20.7969px">(B)</td> <td style="text-align: center; height: 20.7969px">(C)</td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">①</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">surprised </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">working </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">was </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">②</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">surprised </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">to work</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">were</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">③</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">surprising </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">working </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">were</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">④</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">surprising </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">to work</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">was </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">⑤</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">surprising </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">to work</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-33">were</span></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--22">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444950",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
        passageTitle: "본문 05",
      },
      itemTypeInfo: {
        id: "c7ead996-33ab-4138-8250-9e221816deda",
        writeLabel: null,
        editLabel: "어법",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193689",
        status: "completed",
      },
    },
    {
      passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">①</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-30">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-31">He received a call from the chief editor the next day. Sekhar answered with a worried voice. "Your suggestion about my music was very useful. Thank you," the chief editor said, "By the way, where are those articles?"<br>"You gave me ten days to finish them."&nbsp;Sekhar responded, (A) <strong>[ surprising / surprised ]</strong>.<br>"Oh, I\'ve reconsidered. I must positively have them here tomorrow." Five articles in a day! That meant (B) <strong>[ to work / working ]</strong> on them all night long!<br>"Give me a couple of days. sir,"&nbsp;Sekhar asked nervously.<br>"No, I must have them tomorrow morning. And remember, every article must be completely accurate," the chief editor responded.<br>"Yes, sir," said&nbsp;Sekhar. Staying up all night long writing articles (C) <strong>[ was / were ]</strong> a small price to pay for the luxury of telling the truth directly without respect to the chief editor.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-34">윗글에 관한 다음 글의 내용과 일치하지 <span style="text-decoration: underline">않는</span> 것은?</span></div><div class="choice-set"><span class="bbox-35">① The chief editor called Sekhar in a worried voice the next day.<br>② Sekhar was surprised at what the chief editor said on the phone.<br>③ The editor had Sekhar write an article by tomorrow.<br>④ Sekhar has to write five articles in just one day.<br>⑤ The chief editor turned down Sekhar\'s request for more time.<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--24">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444951",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
        passageTitle: "본문 05",
      },
      itemTypeInfo: {
        id: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
        writeLabel: "일치불일치 (불일치)",
        editLabel: "내용일치/불일치",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193690",
        status: "completed",
      },
    },
    {
      passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">①</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-18">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-19">They started going to the chief editor\'s house. "I wasn\'t fortunate enough to have children," the chief editor said&nbsp;ⓐ <span style="text-decoration: underline">excitingly</span>&nbsp;as they walked, "but I prayed to at least have the comfort of music in my life." He chattered endlessly about music: how he began one day out of sheer&nbsp;ⓑ <span style="text-decoration: underline">boredo</span>m; how his teacher at first laughed at him and then gave him hope; how his&nbsp;ⓒ <span style="text-decoration: underline">ambition</span> in life was to forget himself in music.<br>At his home, the chief editor invited&nbsp;Sekhar to sit on a luxurious couch and put several delicious dishes before him. He&nbsp;ⓓ <span style="text-decoration: underline">treated</span>&nbsp;Sekhar like his son-in-law. He even said, "You must listen with an open mind. Don\'t worry about those articles. I will give you an&nbsp;ⓔ <span style="text-decoration: underline">extra</span> week to write them.”<br>"Make it ten days, sir,"&nbsp;Sekhar begged.<br>"All right," the chief editor said generously.<br>The chief editor now began to sing a song and continued with two more.&nbsp;Sekhar started commenting to himself. He croaks like a dozen frogs. He bellows like a buffalo. Now he sounds like old window screens in a storm.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-20">윗글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <span style="text-decoration: underline">않은</span> 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-21" style="border-collapse: collapse; width: 100%"><colgroup><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"></colgroup> <tbody> <tr> <td>① ⓐ</td> <td>② ⓑ</td> <td>③ ⓒ</td> <td>④ ⓓ</td> <td>⑤ ⓔ</td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--14">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444946",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
        passageTitle: "본문 04",
      },
      itemTypeInfo: {
        id: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
        writeLabel: "어휘 (밑줄)",
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193685",
        status: "completed",
      },
    },
    {
      passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-18">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-19">They started going to the chief editor\'s house. "I wasn\'t fortunate enough to have children," the chief editor said&nbsp;ⓐ <span style="text-decoration: underline">excitingly</span>&nbsp;as they walked, "but I prayed to at least have the comfort of music in my life." He chattered endlessly about music: how he began one day out of sheer&nbsp;ⓑ <span style="text-decoration: underline">boredo</span>m; how his teacher at first laughed at him and then gave him hope; how his&nbsp;ⓒ <span style="text-decoration: underline">ambition</span> in life was to forget himself in music.<br>At his home, the chief editor invited&nbsp;Sekhar to sit on a luxurious couch and put several delicious dishes before him. He&nbsp;ⓓ <span style="text-decoration: underline">treated</span>&nbsp;Sekhar like his son-in-law. He even said, "You must listen with an open mind. Don\'t worry about those articles. I will give you an&nbsp;ⓔ <span style="text-decoration: underline">extra</span> week to write them.”<br>"Make it ten days, sir,"&nbsp;Sekhar begged.<br>"All right," the chief editor said generously.<br>The chief editor now began to sing a song and continued with two more.&nbsp;Sekhar started commenting to himself. He croaks like a dozen frogs. He bellows like a buffalo. Now he sounds like old window screens in a storm.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-22">윗글에 관한 다음 글의 내용과 일치하지 <span style="text-decoration: underline">않는</span> 것은?</span></div><div class="choice-set"><span class="bbox-23">① The chief editor told Sekhar many stories about music.<br>② Sekhar was welcomed by the chief editor\'s wife.<br>③ The chief editor extended the time for Sekhar to write the article<br>④ The chief editor sang three songs in front of Sekhar.<br>⑤ Sekhar thought the chief editor\'s songs were not good.<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--16">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444947",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "bdd6e7d8-d888-466c-8766-b943b6bb8108",
        passageTitle: "본문 04",
      },
      itemTypeInfo: {
        id: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
        writeLabel: "일치불일치 (불일치)",
        editLabel: "내용일치/불일치",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193686",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "c7ead996-33ab-4138-8250-9e221816deda",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">①</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-0">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-1">Sekhar believed that truth (A) <strong>[ was / is ]</strong> like the sun. No human being can ever look at it directly in the face without blinking or being dazed. He thought (B) <strong>[ that / what ]</strong> the essence of human relationships consisted in tempering truth so that it might not shock anyone. So, he decided to make today unique ― he had to give and take the absolute truth, whatever (C) <strong>[ was happened / happened ]</strong>. Otherwise, life was not worth living. The day ahead seemed full of possibilities to Sekhar. He told no one about his "experiment.”&nbsp;</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-2">윗글 (A), (B), (C)의 각 괄호 안에서 어법상 맞는 표현으로 가장 적절한 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-3" style="border-collapse: collapse; width: 100%; height: 124.781px"><colgroup><col style="width: 7.01224%"><col style="width: 30.3834%"><col style="width: 31.7195%"><col style="width: 30.8848%"></colgroup> <tbody> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px"></td> <td style="text-align: center; height: 20.7969px">(A)</td> <td style="text-align: center; height: 20.7969px">(B)</td> <td style="text-align: center; height: 20.7969px">(C)</td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">①</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">is</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">that </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">happened </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">②</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">is</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">what </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">was happened</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">③</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">was </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">that </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">was happened</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">④</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">was </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">what </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">happened </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">⑤</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">was </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">what </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-3">was happened</span></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--2">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400437667724",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "c7ead996-33ab-4138-8250-9e221816deda",
        writeLabel: null,
        editLabel: "어법",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193679",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "252d2e0b-7b81-421a-add0-61f1ce3c70d5",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②, ④</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-0">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-1">Sekhar believed that truth (A) <strong>[ was / is ]</strong> like the sun. No human being can ever look at it directly in the face without blinking or being dazed. He thought (B) <strong>[ that / what ]</strong> the essence of human relationships consisted in tempering truth so that it might not shock anyone. So, he decided to make today unique ― he had to give and take the absolute truth, whatever (C) <strong>[ was happened / happened ]</strong>. Otherwise, life was not worth living. The day ahead seemed full of possibilities to Sekhar. He told no one about his "experiment.”&nbsp;</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-4">윗글에 관한 다음 글의 내용과 일치하지 <span style="text-decoration: underline">않는</span> 것을 <span style="text-decoration: underline">모두</span> 고르시오.</span></div><div class="choice-set"><span class="bbox-5">① No man can see the sun without blinking his eyes.<br>② The essence of human relations is to shock someone with good faith.<br>③ Sekhar had to give and receive only absolute truth.<br>④ Sekhar had no desire to live for a day.<br>⑤ Sekhar did not tell anyone about his" experiments."<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--4">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400446056333",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "252d2e0b-7b81-421a-add0-61f1ce3c70d5",
        writeLabel: null,
        editLabel: "내용일치/불일치",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193680",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "c7ead996-33ab-4138-8250-9e221816deda",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">③</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-6">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-7">The very first test came when his wife served him his morning meal. He hesitated over the dish, and (A) <strong>[ which / it ]</strong> she thought was her best cooking. She asked, "Why, isn\'t it good?" At other times, he would have considered her feelings and said, "I feel full, that\'s all." But today he said, "It isn\'t good. I can\'t swallow it." He saw her wince and said to (B) <strong>[ him / himself ]</strong>, "It can\'t be helped. Truth is like the sun.”<br>His next trial was at his office when one of his coworkers came up to him and said, "Did you hear the news? John got fired without notice. Don\'t you think it\'s terrible?"<br>"No,"&nbsp;Sekhar answered.<br>"He was (C) <strong>[ so / such ]</strong> fine a man...." The other coworker began to say. But Sekhar interrupted him and said, "I don\'t think so. He always treated me poorly.”</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-8">윗글 (A), (B), (C)의 각 괄호 안에서 어법상 맞는 표현으로 가장 적절한 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-9" style="border-collapse: collapse; width: 100%; height: 124.781px"><colgroup><col style="width: 7.01224%"><col style="width: 30.3834%"><col style="width: 31.7195%"><col style="width: 30.8848%"></colgroup> <tbody> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px"></td> <td style="text-align: center; height: 20.7969px">(A)</td> <td style="text-align: center; height: 20.7969px">(B)</td> <td style="text-align: center; height: 20.7969px">(C)</td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">①</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">which </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">himself </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">such </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">②</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">which </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">him </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">so</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">③</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">it</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">himself </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">so</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">④</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">it</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">him </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">such </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">⑤</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">it</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">him </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-9">so</span></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--6">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400446056334",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "c7ead996-33ab-4138-8250-9e221816deda",
        writeLabel: null,
        editLabel: "어법",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193681",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-6">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-7">The very first test came when his wife served him his morning meal. He hesitated over the dish, and (A) <strong>[ which / it ]</strong> she thought was her best cooking. She asked, "Why, isn\'t it good?" At other times, he would have considered her feelings and said, "I feel full, that\'s all." But today he said, "It isn\'t good. I can\'t swallow it." He saw her wince and said to (B) <strong>[ him / himself ]</strong>, "It can\'t be helped. Truth is like the sun.”<br>His next trial was at his office when one of his coworkers came up to him and said, "Did you hear the news? John got fired without notice. Don\'t you think it\'s terrible?"<br>"No,"&nbsp;Sekhar answered.<br>"He was (C) <strong>[ so / such ]</strong> fine a man...." The other coworker began to say. But Sekhar interrupted him and said, "I don\'t think so. He always treated me poorly.”</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-10">윗글에 관한 다음 글의 내용과 일치하지 <span style="text-decoration: underline">않는</span> 것은?</span></div><div class="choice-set"><span class="bbox-11">① Sekhar\'s wife asked Sekar about the taste of cooking.<br>② Sekhar spoke carefully considering his wife\'s feelings.<br>③ John was fired from his office without notice.<br>④ Sekhar\'s colleagues were surprised at the news of John.<br>⑤ Sekhar doesn\'t seem to have a good heart for John.<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--8">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400446056335",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
        writeLabel: "일치불일치 (불일치)",
        editLabel: "내용일치/불일치",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193682",
        status: "completed",
      },
    },
    {
      passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "c7ead996-33ab-4138-8250-9e221816deda",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">④</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-24">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-25">As the chief editor finished singing, he asked "Now let me know your opinion."<br>"Can I tell you tomorrow, sir?"&nbsp;Sekhar asked hopefully.<br>"No, I want it immediately ― your honest opinion. Was it good?"<br>"No, sir,"&nbsp;Sekhar replied.<br>"Oh! Do you think I will improve (A) <strong>[ that / if ]</strong> I continue my lessons?"<br>"Absolutely not, sir,"&nbsp;Sekhar said with his voice (B) <strong>[ shaken / shaking ]</strong>. He felt unhappy that he could not speak more&nbsp;supportively. Truth, he thought, required as much strength to give as to receive. All the way home he felt worried. He felt that his office life was going to be difficult from now on. Everything depended on the chief editor\'s will.<br>When he arrived home, his wife looked angry. He knew that she was still upset with him for his comment that morning. Two casualties today,&nbsp;Sekhar said to himself. If I do this for a week, I won\'t have a single friend (C) <strong>[ leave / left ]</strong>.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-26">윗글 (A), (B), (C)의 각 괄호 안에서 어법상 맞는 표현으로 가장 적절한 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-27" style="border-collapse: collapse; width: 100%; height: 124.781px"><colgroup><col style="width: 7.01224%"><col style="width: 30.3834%"><col style="width: 31.7195%"><col style="width: 30.8848%"></colgroup> <tbody> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px"></td> <td style="text-align: center; height: 20.7969px">(A)</td> <td style="text-align: center; height: 20.7969px">(B)</td> <td style="text-align: center; height: 20.7969px">(C)</td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">①</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">that </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">shaken </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">left </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">②</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">that </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">shaking </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">leave</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">③</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">if</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">shaken </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">leave</span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">④</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">if</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">shaking </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">left </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">⑤</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">if</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">shaking </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-27">leave</span></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--18">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444948",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
        passageTitle: "본문 05",
      },
      itemTypeInfo: {
        id: "c7ead996-33ab-4138-8250-9e221816deda",
        writeLabel: null,
        editLabel: "어법",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193687",
        status: "completed",
      },
    },
    {
      passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">③</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-24">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-25">As the chief editor finished singing, he asked "Now let me know your opinion."<br>"Can I tell you tomorrow, sir?"&nbsp;Sekhar asked hopefully.<br>"No, I want it immediately ― your honest opinion. Was it good?"<br>"No, sir,"&nbsp;Sekhar replied.<br>"Oh! Do you think I will improve (A) <strong>[ that / if ]</strong> I continue my lessons?"<br>"Absolutely not, sir,"&nbsp;Sekhar said with his voice (B) <strong>[ shaken / shaking ]</strong>. He felt unhappy that he could not speak more&nbsp;supportively. Truth, he thought, required as much strength to give as to receive. All the way home he felt worried. He felt that his office life was going to be difficult from now on. Everything depended on the chief editor\'s will.<br>When he arrived home, his wife looked angry. He knew that she was still upset with him for his comment that morning. Two casualties today,&nbsp;Sekhar said to himself. If I do this for a week, I won\'t have a single friend (C) <strong>[ leave / left ]</strong>.</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-28">윗글에 관한 다음 글의 내용과 일치하지 <span style="text-decoration: underline">않는</span> 것은?</span></div><div class="choice-set"><span class="bbox-29">① The chief editor asked Sekhar to evaluate the song he sang.<br>② Sekhar spoke frankly about the chief editor\'s singing skills.<br>③ The chief editor was saddened by Sekhar\'s trembling voice.<br>④ Sekhar was worried about office life all the way back home.<br>⑤ When Sekhar got home, Sekhar\'s wife looked angry.<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--20">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444949",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "58ddc54f-6021-4566-97f6-2d70b48c60b9",
        passageTitle: "본문 05",
      },
      itemTypeInfo: {
        id: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
        writeLabel: "일치불일치 (불일치)",
        editLabel: "내용일치/불일치",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193688",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "30387ccd-7601-4353-afe6-dd906a88218d",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-93">다음 글을 읽고 물음에 답하시오.</span></div><div class="example">\n<div class="example-content" style="text-align: justify;"><span class="bbox-94">Sekhar believed that truth is like the sun. No human being can ever look at it ⓐ&nbsp;<span style="text-decoration: underline;">indirectly</span> in the face ⓑ <span style="text-decoration: underline;">without</span> blinking or being dazed.</span></div>\n</div><div class="contents passage" style="text-align: justify;"><span class="bbox-95">(A) So, he decided to make today unique - he had to give and take the ⓒ <span style="text-decoration: underline">absolute</span> truth, whatever happened.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-96">(B) He thought that the essence of human relationships consisted in ⓓ <span style="text-decoration: underline">tempering</span> truth so that it might not shock anyone.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-97">(C) Otherwise, life was not worth living. The day ahead seemed ⓔ <span style="text-decoration: underline">full</span> of possibilities to Sekhar. He told no one about his "experiment."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-98">주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시 오.</span></div><div class="choice-set"> <table border="1" class="bbox-99" style="border-collapse: collapse; width: 100%; height: 67.1952px"><colgroup><col style="width: 50%"><col style="width: 50%"></colgroup> <tbody> <tr style="height: 22.3984px"> <td style="height: 22.3984px">① (A) - (B) - (C)</td> <td style="height: 22.3984px">② (B) - (A) - (C)</td> </tr> <tr style="height: 22.3984px"> <td style="height: 22.3984px">③ (C) - (A) - (B)</td> <td style="height: 22.3984px">④ (C) - (B) - (A)</td> </tr> <tr style="height: 22.3984px"> <td style="height: 22.3984px">⑤ (B) - (C) - (A)</td> <td style="height: 22.3984px"></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--62">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400471222186",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "30387ccd-7601-4353-afe6-dd906a88218d",
        writeLabel: null,
        editLabel: "순서/연결어",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "low",
      },
      uciInfo: {
        code: "I110:A+REG-0000193709",
        status: "completed",
      },
    },
    {
      passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">①</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-93">다음 글을 읽고 물음에 답하시오.</span></div><div class="example">\n<div class="example-content" style="text-align: justify;"><span class="bbox-94">Sekhar believed that truth is like the sun. No human being can ever look at it ⓐ&nbsp;<span style="text-decoration: underline;">indirectly</span> in the face ⓑ <span style="text-decoration: underline;">without</span> blinking or being dazed.</span></div>\n</div><div class="contents passage" style="text-align: justify;"><span class="bbox-95">(A) So, he decided to make today unique - he had to give and take the ⓒ <span style="text-decoration: underline">absolute</span> truth, whatever happened.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-96">(B) He thought that the essence of human relationships consisted in ⓓ <span style="text-decoration: underline">tempering</span> truth so that it might not shock anyone.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-97">(C) Otherwise, life was not worth living. The day ahead seemed ⓔ <span style="text-decoration: underline">full</span> of possibilities to Sekhar. He told no one about his "experiment."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-100">윗글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <span style="text-decoration: underline">않은</span> 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-101" style="border-collapse: collapse; width: 100%"><colgroup><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"></colgroup> <tbody> <tr> <td>① ⓐ</td> <td>② ⓑ</td> <td>③ ⓒ</td> <td>④ ⓓ</td> <td>⑤ ⓔ</td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--64">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400471222187",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "25ec881f-4097-4e01-a0be-ef6a31acb734",
        passageTitle: "본문 01",
      },
      itemTypeInfo: {
        id: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
        writeLabel: "어휘 (밑줄)",
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193710",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "c7ead996-33ab-4138-8250-9e221816deda",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">⑤</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-12">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-13">During lunch time, Sekhar received a note from the chief editor: "Please see me before you go home." Sekhar thought to himself that it must be about the horrible feature articles that he had to write. He hadn\'t completed five articles that were due soon. He had avoided the work for weeks, which put him under great pressure.<br>He (A) <strong>[ entered into / entered ]</strong> the chief editor\'s room with a very polite "Good evening, sir.”<br>The chief editor looked up at him in a very friendly manner and asked, "Are you free this evening?”<br>"Yes, pretty much. Do you need me for anything, sir?" asked Sekhar. "Yes," replied the chief editor, (B) <strong>[ smiled / smiling ]</strong> to himself. "You didn\'t know about my interest in music, did you? I\'ve been learning and practicing secretly, and now I want you to hear me this evening. I want your opinion. I know it will be valuable.”<br>Sekhar\'s opinions about music were well-known. He was one of the most serious music critics in the town. But he never thought (C) <strong>[ what / that ]</strong> his interest in music would lead him into this kind of situation.<br>"It\'s rather a surprise for you, isn\'t it?" asked the chief editor.&nbsp; "I\'ve spent so much money on learning and I\'ve kept it a secret.”</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-14">윗글 (A), (B), (C)의 각 괄호 안에서 어법상 맞는 표현으로 가장 적절한 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-15" style="border-collapse: collapse; width: 100%; height: 124.781px"><colgroup><col style="width: 7.01224%"><col style="width: 30.3834%"><col style="width: 31.7195%"><col style="width: 30.8848%"></colgroup> <tbody> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px"></td> <td style="text-align: center; height: 20.7969px">(A)</td> <td style="text-align: center; height: 20.7969px">(B)</td> <td style="text-align: center; height: 20.7969px">(C)</td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">①</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">entered into</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">smiled </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">what </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">②</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">entered into</span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">smiling </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">that </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">③</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">entered </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">smiled </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">that </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">④</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">entered </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">smiling </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">what </span></td> </tr> <tr style="height: 20.7969px"> <td style="text-align: center; height: 20.7969px">⑤</td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">entered </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">smiling </span></td> <td style="text-align: center; height: 20.7969px"><span class="bbox-15">that </span></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--10">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400446056336",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "c7ead996-33ab-4138-8250-9e221816deda",
        writeLabel: null,
        editLabel: "어법",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193683",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-12">다음 글을 읽고 물음에 답하시오.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-13">During lunch time, Sekhar received a note from the chief editor: "Please see me before you go home." Sekhar thought to himself that it must be about the horrible feature articles that he had to write. He hadn\'t completed five articles that were due soon. He had avoided the work for weeks, which put him under great pressure.<br>He (A) <strong>[ entered into / entered ]</strong> the chief editor\'s room with a very polite "Good evening, sir.”<br>The chief editor looked up at him in a very friendly manner and asked, "Are you free this evening?”<br>"Yes, pretty much. Do you need me for anything, sir?" asked Sekhar. "Yes," replied the chief editor, (B) <strong>[ smiled / smiling ]</strong> to himself. "You didn\'t know about my interest in music, did you? I\'ve been learning and practicing secretly, and now I want you to hear me this evening. I want your opinion. I know it will be valuable.”<br>Sekhar\'s opinions about music were well-known. He was one of the most serious music critics in the town. But he never thought (C) <strong>[ what / that ]</strong> his interest in music would lead him into this kind of situation.<br>"It\'s rather a surprise for you, isn\'t it?" asked the chief editor.&nbsp; "I\'ve spent so much money on learning and I\'ve kept it a secret.”</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-16">윗글에 관한 다음 글의 내용과 일치하지 <span style="text-decoration: underline">않는</span> 것은?</span></div><div class="choice-set"><span class="bbox-17">① Sekhar received a note from the chief editor.<br>② Sekhar has been avoiding the chief editor for weeks and that\'s a huge burden.<br>③ The chief editor asked Sekhar to listen to his music.<br>④ Sekhar is one of the music critics in the town.<br>⑤ The chief editor spent a lot of money learning music.<br></span></div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--12">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400454444945",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "ec5b0f5f-a16d-4f88-8a3b-3bfe3591de39",
        writeLabel: "일치불일치 (불일치)",
        editLabel: "내용일치/불일치",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193684",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "30387ccd-7601-4353-afe6-dd906a88218d",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-111">다음 글을 읽고 물음에 답하시오.</span></div><div class="example">\n<div class="example-content" style="text-align: left"><span class="bbox-112">During lunch time,&nbsp;Sekhar received a note from the chief editor: "Please see me before you go home." Sekhar thought to himself that it must be about the horrible feature articles that he had to write. He hadn\'t completed five articles that were due soon. He had avoided the work for weeks, which put him under great pressure.</span></div>\n</div><div class="contents passage" style="text-align: justify;"><span class="bbox-113">(A) "Yes," replied the chief editor, smiling to himself. "You didn\'t know about my ⓐ <span style="text-decoration: underline">interest</span> in music, did you? I\'ve been learning and practicing secretly, and now I want you to hear me this evening. I want your opinion. I know it will be ⓑ <span style="text-decoration: underline">valueless</span>."</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-114">(B) He entered the chief editor\'s room with a very polite "Good evening, sir." The chief editor looked up at him in a very friendly ⓒ <span style="text-decoration: underline">manner</span> and asked, "Are you free this evening?"<br>"Yes, pretty much. Do you need me for anything, sir?" asked Sekhar.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-115">(C) Sekhar\'s opinions about music were well-known. He was one of the most ⓓ <span style="text-decoration: underline">serious</span> music critics in the town. But he never thought that his interest in music would lead him into this kind of situation.<br>"It\'s rather a ⓔ <span style="text-decoration: underline">surprise</span> for you, isn\'t it?" asked the chief editor. "I\'ve spent so much money on learning and I\'ve kept it a secret."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-116">주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시오.</span></div><div class="choice-set"> <table border="1" class="bbox-117" style="border-collapse: collapse; width: 100%; height: 67.1952px"><colgroup><col style="width: 50%"><col style="width: 50%"></colgroup> <tbody> <tr style="height: 22.3984px"> <td style="height: 22.3984px">① (A) - (B) - (C)</td> <td style="height: 22.3984px">② (B) - (A) - (C)</td> </tr> <tr style="height: 22.3984px"> <td style="height: 22.3984px">③ (C) - (A) - (B)</td> <td style="height: 22.3984px">④ (C) - (B) - (A)</td> </tr> <tr style="height: 22.3984px"> <td style="height: 22.3984px">⑤ (B) - (C) - (A)</td> <td style="height: 22.3984px"></td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--70">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400479610798",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "30387ccd-7601-4353-afe6-dd906a88218d",
        writeLabel: null,
        editLabel: "순서/연결어",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "low",
      },
      uciInfo: {
        code: "I110:A+REG-0000193714",
        status: "completed",
      },
    },
    {
      passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
      answerType: "choice",
      isHtmlData: true,
      itemTypeId: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
      answerAreaInfo: {
        workIds: [],
        htmlText: '<div class="answer">②</div>',
      },
      passageAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric passage" style="text-align: justify;"><span class="bbox-111">다음 글을 읽고 물음에 답하시오.</span></div><div class="example">\n<div class="example-content" style="text-align: left"><span class="bbox-112">During lunch time,&nbsp;Sekhar received a note from the chief editor: "Please see me before you go home." Sekhar thought to himself that it must be about the horrible feature articles that he had to write. He hadn\'t completed five articles that were due soon. He had avoided the work for weeks, which put him under great pressure.</span></div>\n</div><div class="contents passage" style="text-align: justify;"><span class="bbox-113">(A) "Yes," replied the chief editor, smiling to himself. "You didn\'t know about my ⓐ <span style="text-decoration: underline">interest</span> in music, did you? I\'ve been learning and practicing secretly, and now I want you to hear me this evening. I want your opinion. I know it will be ⓑ <span style="text-decoration: underline">valueless</span>."</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-114">(B) He entered the chief editor\'s room with a very polite "Good evening, sir." The chief editor looked up at him in a very friendly ⓒ <span style="text-decoration: underline">manner</span> and asked, "Are you free this evening?"<br>"Yes, pretty much. Do you need me for anything, sir?" asked Sekhar.</span></div><div class="contents passage" style="text-align: justify;"><span class="bbox-115">(C) Sekhar\'s opinions about music were well-known. He was one of the most ⓓ <span style="text-decoration: underline">serious</span> music critics in the town. But he never thought that his interest in music would lead him into this kind of situation.<br>"It\'s rather a ⓔ <span style="text-decoration: underline">surprise</span> for you, isn\'t it?" asked the chief editor. "I\'ve spent so much money on learning and I\'ve kept it a secret."</span></div>',
      },
      questionAreaInfo: {
        workIds: [],
        htmlText:
          '<div class="rubric question" style="text-align: justify;"><span class="bbox-118">윗글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <span style="text-decoration: underline">않은</span> 것은?</span></div><div class="choice-set"> <table border="1" class="bbox-119" style="border-collapse: collapse; width: 100%"><colgroup><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"></colgroup> <tbody> <tr> <td>① ⓐ</td> <td>② ⓑ</td> <td>③ ⓒ</td> <td>④ ⓓ</td> <td>⑤ ⓔ</td> </tr> </tbody> </table> </div>',
      },
      explanationAreaInfo: {
        workIds: [],
        htmlText: '<div class="explanation"><span class="bbox--72">&nbsp;</span></div>',
      },
      originHandoutId: "3384996875609310532",
      originHandoutDataItemId: "3401794400479610799",
      sourceInfo: {
        id: "3379766691641689539",
        type: "textbook",
        title: "[동아] 고등 영어 Ⅰ (권혁승)",
        unitId: "470bb076-43f3-4305-a3e3-9abf8442798f",
        unitTitle: "4과",
        passageId: "eaff9aea-c047-424b-93ae-1a8e6fb637ee",
        passageTitle: "본문 02",
      },
      itemTypeInfo: {
        id: "8c5f5c7c-69dd-45b8-9d71-9b3475b0cc32",
        writeLabel: "어휘 (밑줄)",
        editLabel: "어휘/영영풀이",
      },
      handoutInfo: {
        id: "3384996875609310532",
        title: "동아(권) 영어 I 4과  by 하박영어",
        author: "쏠북연구소",
        externalProvider: null,
      },
      difficultyInfo: {
        value: "moderate",
      },
      uciInfo: {
        code: "I110:A+REG-0000193715",
        status: "completed",
      },
    },
  ],
  summary: {
    essayItemCount: 10,
    choiceItemCount: 20,
  },
};
const useDataTransformer = () => {
  const groupbyQuestion = useMemo(() => {
    // 1. 지문으로 그룹화 해주기 위해 groupby 사용
    const groupbyPassage = _.groupBy(data.items, (question) => question.passageAreaInfo.htmlText);

    /**
     * 2. 배열로 활용하기 위해 toArray 사용
     * [
     *   [ {question1}, {question2} ],                  << 한 그룹에 문제 2개
     *   [ {question3} ],                               << 한 그룹에 문제 1개
     *   [ {question4}, {question5}, {question5} ],     << 한 그룹에 문제 3개
     *   ...
     * ]
     */
    const toArray = _.toArray(groupbyPassage);

    let startNumber = 1;
    return toArray.map((item) => {
      const isGroup = item.length > 1;

      // 3. 문제 번호 (Label) 설정을 위한 Number 계산
      const groupLength = item.length;
      const endNumber = startNumber + groupLength - 1;

      const data = { items: item, isGroup: isGroup, startNumber, endNumber };

      startNumber = endNumber + 1;

      return data;
    });
  }, [data.items]);
  return { data: groupbyQuestion };
};
export default useDataTransformer;
