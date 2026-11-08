# Architecture

## 1. 全体構成

外部依存やビルド工程を持たない静的Webアプリです。元の最新版は `index.html` 1ファイル完結でしたが、GitHub上では保守性のため HTML / CSS / JavaScript を静的ファイルへ分割しています。

```text
index.html
├─ styles-1.css ... styles-4.css
└─ app-1.js ... app-7.js
   └─ audio/ : 同梱の接近放送・発車放送 MP3
```

GitHub Pagesの静的配信だけで動作し、ページ読み込み後の主要ゲーム処理はブラウザ内で完結します。

## 2. ゲーム状態

主要な状態はJavaScriptの変数とDOM状態で管理しています。

- `stations`: 路線・駅情報
- `stationIndex`: 現在駅
- `clearStations`: クリア駅数
- `phase`: ゲーム進行状態
- `difficulty`: 難易度
- `subjectMode`: 科目
- `departureMelodyVariant`: 発車メロディのローテーション番号
- `currentProblem`: 現在の問題

状態管理ライブラリは使用していません。

## 3. 主要関数

### 問題生成

- `makeAngleProblem()` : 角度問題
- `makeGraphProblem()` : 折れ線グラフ問題
- `makeFractionProblem()` : 分数問題
- `makeMultiplyProblem()` : かけ算問題（`app-7.js`）
- `makeProblem()` : 選択科目に応じた問題生成
- `newProblem()` : 次の問題を画面へセット
- `drawAngle()` / `drawLineGraph()` : 問題図の描画
- `setProblemKind()` : 問題表示領域の切替

### 電車・駅進行

- `arrive()` : 駅への到着処理
- `correct()` : 正解後の一連の遷移開始
- `departurePass()` : 発車・通過アニメーション
- `carStep()` : 1両分の寸法計算
- `stoppedLeft()` / `offscreenLeft()` : 停車位置 / 画面外位置
- `setConsistLeft()` : 編成全体の位置反映
- `startWheelMotion()` / `stopWheelMotion()` : 列車の実移動量から車輪の回転角を反映
- `updateStationBackground()` : 駅別背景の切替
- `renderRoute()` : 路線表示の更新

### ドア

- `setDoorOpen(isOpen, animateClose)` : ドア状態の中心関数
- `pneumaticDoorSound()` : 空気音
- `doorImpactSound()` : 戸当たり音

ドアは閉まり始め、左右の時間差、接触、バウンド、密着までを段階制御しています。

### 音

効果音・ベル・メロディはWeb Audio APIで合成し、駅放送は`audio/`内のMP3を再生します。

- `ensureAudio()` : AudioContext準備
- `tone()` : 基本音生成
- `arrivalSound()` : 到着音
- `correctSound()` : 正解音
- `departureSound()` : 加速音
- `playDepartureChime()` : 発車メロディの前に鳴らすオリジナル上昇音ベル
- `playStationAnnouncement(kind)` : `audio/` 内の接近放送・発車放送を再生・停止
- `playOriginalDepartureMelody()` : 第1メロディ
- `playSpringBoxStyleMelody()` : 第2メロディ
- `playVerdeRayoStyleMelody()` : 第3メロディ
- `playDepartureMelody()` : 3曲を順番に選択

## 4. イベントの基本フロー

```text
ゲーム開始
  ↓
arrive()
  ↓
接近放送終了
   ↓
入線・停車
   ↓
newProblem()
  ↓
回答
  ├─ 不正解 → 同じ駅で再挑戦
  └─ 正解 → correct()
              ↓
           ドア開
              ↓
           発車ベル・メロディ
              ↓
           発車放送終了
              ↓
           ドア閉
              ↓
           departurePass()
              ↓
           次駅へ
```

音・ドア・発車はタイミング依存が強いため、この順番を変更するときは回帰確認が必要です。

## 5. 変更時に壊れやすい箇所

- 到着時に閉扉音を誤発火させないこと
- ドアが閉まり切る前に発車しないこと
- リセット後に古い駅到着・発車タイマーがゲームを再開しないこと
- iOS系ブラウザではユーザー操作を起点にAudioContextを開始すること
- 科目追加時は図・単位・回答欄の切替も確認すること
- 分割ファイル間の関数名・状態変数の依存を壊さないこと

## 6. 更新時のチェックリスト

1. JavaScriptの構文チェックが通ること。
2. ゲーム開始 → 到着 → 出題まで進むこと。
3. 角度 / グラフ / 分数 / ミックスで最低1問ずつ生成できること。
4. 接近放送終了後に入線し、正解 → ドア開 → 発車ベル・メロディ → 発車放送 → 閉扉 → 発車の順に進むこと。
5. 到着時に戸当たり音や空気音が誤って鳴らないこと。
6. ドアが閉まり切る前に列車が動かないこと。
7. 3種類の発車メロディが順番に切り替わること。
8. 駅別背景が正しく切り替わること。
9. 速度計が車両や問題UIに重ならないこと。
10. タッチ環境で操作不能な要素がないこと。
11. 車輪の回転角が列車の画面上の移動量に連動し、停車中は回転しないこと。
12. 対応ブラウザで駅への接近放送が流れ、消音・リセットで停止すること。
