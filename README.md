# ダウンロードの仕方
このWebページの右側にReleasesという項目があるので、そこから行ける先で最新のZipをダウンロードしてください。

# 規約
このツール、またはこのツールに含まれるファイルを使用して作った動画を公開する場合
* ニコニコ動画で公開するなら  
コンテンツツリーの親作品に、下記動画を登録してください。  
* 他のサイトで公開するなら  
動画説明欄などに、下記動画へのリンクを掲載してください。

動画URL：https://www.nicovideo.jp/watch/sm39284886

手間なのは承知しておりますが、このツールを多くの動画製作者に周知し、楽をしていただくためとなります。よろしくお願いいたします。

# このツールが解決する「面倒ごと」
* 琴葉葵と、鳴花ミコトと、IAと、六花と、ゆっくり霊夢と、ずんだもんと、アベルーニが会話する動画を作りたいのに、トークソフトを7種類も操作しなくちゃいけなくて面倒。

* トークソフトには「攻撃力」と読ませたいけど、字幕ファイルには「ATK」と出力したい時に面倒。

* シナリオファイルで、立ち絵の表情パターンを指定しておけなくて面倒。

* トークソフト毎に、セリフ後の終了ポーズの長さがばらばらで調整が面倒。

# どう解消するのか
サクラエディタでセリフを編集し、マクロを使って操作することで解消します。

# 参考動画
ツール解説動画  
https://www.nicovideo.jp/watch/sm39284886

TalkEditorUtilを使って動画を作ってみる動画  
https://www.nicovideo.jp/watch/sm39284906

# セットアップする
setup.batを起動すると、サクラエディタをダウンロードして展開し、マクロキーの設定をしてくれます。  
ついでにexotoolsもダウンロードします。

## 注意：以前からサクラエディタを使っている方へ
従来のサクラエディタウインドウが開いていると、TalkEditorUtilで用意したサクラエディタでテキストを開いても、マクロやショートカットキーの設定が従来のものが適用されてしまいます。

そのため「他のサクラエディタウインドウを全て閉じてから」、TalkEditorUtilのマクロが適用されたサクラエディタを起動してください。

既にサクラエディタを使っている人は、tools/macroフォルダの中身を自分の愛用のサクラエディタにコピーして、ショートカットキーを設定するのがおすすめです。


# 使うための準備
1. 利用したいトークソフトを起動しておきます。
1. テキストファイルをサクラエディタで開きます。  
テキストファイルを"ここにテキストファイルをドラッグイン.bat"にドラッグインしても良いです。

サンプルの例では、以下の5つのトークソフトを起動してください。
* VOICEROID2
* GynoidTalk
* CeVIO CS7
* CeVIO AI
* 棒読みちゃん

**※SofTalkはver1.93.50以降を使ってください。**  

**※CeVIO CS6は非対応です。7にアップデートしましょう。**

**※VOICEROID2は 32bit, 64bit両対応ですが、64bit版を導入するのをお勧めします。**

# 使ってみる
付属している"sample.txt"を、"ここにテキストファイルをドラッグイン.bat"にドラッグインしてください。  
サクラエディタでテキストファイルが開かれます。

## ◆しゃべらせる（F5キー)
しゃべらせたいセリフ行にテキストカーソルを移動させ、F5キーを押す。

## ◆しゃべっているのを止める（F6キー）
F6キーを押す。

## ◆セリフをWav出力する（F7キー）
対象のセリフ位置にテキストカーソルを移動させ、F7キーを押す。

ファイル名の末尾には自動的に、"-0"や"-56"といった番号が付きます。この番号はセリフの通し番号です。

※範囲選択をしている状態でおこなうと、範囲内のセリフ全てを出力します。

## ◆すべてのセリフを、WAV出力する（F8キー）
F8キーを押す。

ファイル名の末尾には自動的に、"-0"や"-56"といった番号が付きます。この番号はセリフの通し番号です。

## ◆セリフの数を確認する（F9キー）
F9を押すと、セリフの数を確認できるダイアログがでます。

## ◆次のセリフにジャンプ（F10キー）
F10を押すと、次のセリフの話者指定行にテキストカーソルが移動します。  

## ◆次のセリフにジャンプ（Shift+F10キー）
Shiftを押しなたがF10を押すと、前のセリフの話者指定行にテキストカーソルが移動します。


## ◆終了させる
上記の機能のどれかを使うと、自動的に"RemoteTalkEditor64"というウインドウが起動したはずです。  
これを閉じれば終了となります。  

また、最小化した場合はタスクトレイに格納されています。

# 記法

```
@琴葉 葵 - 通常
    ボク、お兄ちゃんのこと 大好きだよ
    いっぱい 可愛がってね{？}
@IA - 通常
    ずるいよ、ボクだって{マスター|ご主人様}のこと
    大好きなのに
```

## ◆話者指定
@から始まる行が、話者指定行です。
@より前に、空白やタブを入れてはいけません。

## ◆会話内容
話者指定行から、次の話者指定行（またはファイル末尾）までの間は会話内容になります。

見やすくするために、行の先頭にタブや空白を入れても構いません。
行頭と行末のそれらは無いものとして扱われます。

会話中に出てくるタブや空白は、トークソフト上では無視され、字幕には反映されます。

特殊記法として { } と | を使った記法をサポートします。
* {マスター|ご主人様}   
これはトークソフト上には「マスター」と出力しますが、字幕ファイルでは「ご主人様」と出力します。
* {？}   
トークソフト上には「？」をつけますが、字幕ファイルでは「？」を消します。{？|}の省略形です。
* {|？}   
トークソフト上には何もつけませんが、字幕ファイルでは「？」をつけます。

* 字幕にどうしても{}記号を使いたい場合は、{の代わりに{{と、}の代わりに}}と記述してください。

## ◆表情指定
```
@琴葉 葵 - 通常/5 8 12
    ボク、お兄ちゃんのこと 大好きだよ
    いっぱい 可愛がってね{？}
```
プリセット指定の後ろに / と、半角スペース区切りの数値でパラメータを書きます。  
するとWav出力時に filename.wav と一緒に出力される filename.param.txt にパラメータが出力されます。

この状態でexotoolsを使用することで、対応する多目的スライダーオブジェクトに5, 8, 12が最初から設定されている状態となります。

# 設定ファイル
シナリオファイルで、設定ファイルが置いてあるフォルダを指定します。  
フォルダパスは、シナリオファイルの位置を基点とします。
```
$CONFIG = config
```
この例の場合、シナリオファイルと同じフォルダにconfigフォルダをコピーしてください。

詳しくはsample.txtに書かれています。

## ◆プリセットの設定
"presets.txt"を編集してください。 
書き方は設定ファイルに書いてあります。

該当するプリセットが見つからない場合、トークソフト側で登録されているプリセットが使用されます。

※A.I.VOICEや、VOICEROID2や、GynoidTalkのプリセットは、ここの設定は参照しません。トークソフト側で登録してください。

※VOICEROID＋EX系は トークソフト側にプリセット機能がないため、必ずここで設定してください。

## ◆話者の設定（キャラクターを、どのトークソフトでしゃべらせるかの指定）
"talkers.txt"を編集してください。  
書き方は設定ファイルに書いてあります。

サンプルとして記述されているもの以外に足したい場合、編集してください。

## ◆終末ポーズの設定
"addsilence.txt"を編集してください。  
書き方は設定ファイルに書いてあります。

## ◆CoeFont.CLOUDの設定
"coefont.txt"を編集してください。  
書き方は設定ファイルに書いてあります。

CoeFont.CLOUDのAPIを使うため、それに必要なあなたのAPIアクセス情報を記入する必要があります。  
CoeFont.CLOUDは、1文字ごとにポイントが消費されますのでご注意ください。  
詳細はCoeFont.CLOUDの料金ページをご確認ください。


# CeVIOの調声対応
CeVIOは外部ソフトから「調声」することが難しく、このツールも「調声」には対応していません。

代わりに、ボイス出力時に以下の2つが生成されますので、利用してみてください。
* CeVIO系のソフトで読み込める、セリフ一覧
* セリフ一覧を読み込んで調声。その後出力した調声済みwavを、TalkEditorUtilで生成した際のwavファイルへと名前置換するbatファイル

# 現在の対応トークソフト
* A.I.VOICE
* VOICEROID2(64bit版)
* VOICEROID2(64bit版)
* VOICEROID2(32bit版)
* GynoidTalk
* CeVIO CS7(IA, ONE, さとうささら, すずきつづみ, タカハシ)
* CeVIO AI(IA, ONE, 小春六花, 弦巻マキ (日), さとうささら)
* SofTalk(ver1.93.50以降)
* 音街ウナTalk Ex
* VOICEROID＋ 民安ともえ EX
* VOICEROID＋ 京町セイカ EX
* VOICEROID＋ 東北ずん子 EX
* VOICEROID＋ 東北きりたん EX
* おそらく他のVOICEROID＋ EX系も動くはず
* VOICEVOX
* CoeFont.CLOUD
* COEIROINK on VOICEVOX
* BouyomiChan
* TALQu

# その他機能
- トークソフトで「！？」「！！！？？？？」「！？！？」といった、！と？の混同を読み上げさせる場合、「？」に省略されます。
- トークソフトで文末に「」『』【】（）()[]の記号があると、文末ポーズが二重に付与されてしまうパターンがあるため、省略されます。


# 既知のバグ
* CeVIOでWav出力する際、設定されているポーズ長が反映されない。結果、「、」も「。」も同じ長さの休符となる。  
→ CeVIO公式に不具合として報告したところ、改善すべき点として受け入れていただけたようです。しばらく待ちましょう。

# バグ報告
https://twitter.com/suzune25254649

こちらまで、DMやリプで報告をくださると凄く喜びます。（バグはなるべく直したい）

# 断り書き
このツールは規約を守る範囲で自由にお使いください。  
ただし、このツールを利用した際に発生した いかなる損失や損害が発生についても、作者は一切の責任を負いかねます。

# 更新履歴

## Ver1.1.8
- 棒読みちゃんに対応
- TALQuに対応

## Ver1.1.7
- COEIROINK on VOICEVOX に対応。
- A.I.VOICE ver1.3.0.1に対応。（1.3.0.0やそれ以前でも動きます）
- アップデート告知ダイアログで、ダウンロードページをブラウザで開くことができるようになりました。
- 追記：同Ver1.1.7にて差し換えを行ないました。Friendly系のDLLを同梱するのではなく、nuget経由で公式からダウンロード取得するようにしました。

## Ver1.1.6
- A.I.VOICE、VOICEROID2、GynoidTalk、Voiceroid+Ex、音街ウナTalk Exの音声保存時に、保存ダイアログが出ないようになり、保存ミスが起きないようになりました。
- トークソフトで文末に「」『』【】（）()[]の記号があると、文末ポーズが二重に付与されてしまうパターンがあるため、省略するようにしました。

## Ver1.1.5
- CoeFont.CLOUDで動かなくなっていたのを修正。
- CoeFont.CLOUDで「前回と同じ設定、同じセリフ」を再生する際に、ポイントが減らないようキャッシュするようにしました。

## Ver1.1.4
- VOICEVOXに対応。
- CoeFont.CLOUDに対応。
- 起動時に自動的にバージョンアップチェックを行うようになりました。

## Ver1.1.3
- CeVIO AIの弦巻マキ (日)に対応。
- GoogleIME利用時に、Voiceroid2、A.I.VOICE、Gynoidトークにてファイル保存がうまくいかない場合があった問題を修正
- CeVIO AIのバージョンアップにより、ONEの名前がOИEに変更されて動かなくなったことへの対応。ONEでもOИEでの動くようにしてあります。
- CeVIO AIのさとうささら、IAが正しく動かないことがあったので修正。
- アンチウイルスソフトが誤検出してしまう問題を修正

## ver1.1.2
- A.I.VOICEに対応しました。
- 一部環境で、ボイスロイド系のWav出力に失敗するバグを修正しました。
- ボイス出力に失敗した際に、ツールがフリーズしてしまう問題を修正しました。

## ver1.1.1
- さとうささら、すずきつづみ、タカハシが使えるように対応しました。
- 一部環境で、ボイスロイド系のWav出力に失敗するバグを修正しました。

## ver1.1.0
- シナリオファイルで、設定ファイルが置かれているフォルダを指定できるになりました。
- 「！？」といった文章をトークソフトに送信する場合、「？」に置換されるようになりました。

# ライセンス
* Codeer.Friendly
* Codeer.Friendly.Windows
* Codeer.Friendly.Windows.Grasp
* Codeer.Friendly.Windows.NativeStandardControls
* Codeer.TestAssistant.GeneratorToolKit
* RM.Friendly.WPFStandardControls

Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.
