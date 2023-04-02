# 設計

## クラス図

```mermaid
classDiagram
    class Judger{
        -String laughtCharacters
        -Number passThreshold
        -Object node
        -Number waitingSec
        +judge() bool
    }
```

## シーケンス図

```mermaid
sequenceDiagram
    actor User
    actor Judgers
    User->>Judgers: ギャグを披露
    Judgers->>Judgers: 判定
    alt ２名以上が不合格
        Judgers->>User: 不合格
    else ２名以上が合格
        Judgers->>User: 合格
    end
```

## ギャグ判定ロジック

- ギャグの文字列を固定長のハッシュに変換
- 審査員ごとに異なる笑いのツボを、文字種類(laughtCharacters) で定義
- laughtCharacters にマッチした文字数の、全ハッシュ長に対する割合(passThreshold) で判定
  - passThreshold の値以上だと合格
  - passThreshold の値未満だと不合格
