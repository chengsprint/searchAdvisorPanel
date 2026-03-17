# 새로운 VPS에서 오케스트레이션 셋업 가이드

## 1단계: cokacdir 설치

```bash
# cokacdir 설치 (Telegram 기능 포함)
/bin/bash -c "$(curl -fsSL https://cokacdir.cokac.com/install.sh)"

# 설치 확인
cokacdir --version
cokacdir --help | grep -E "(ccserver|message|chat)"
```

## 2단계: Telegram Bot 생성

1. **BotFather에게 봇 생성 요청**
   - Telegram에서 @BotFather 검색
   - `/newbot`으로 봇 생성
   - 각 역할별 봇 생성 (총 5개):
     - Architect 봇 (오케스트레이터)
     - Coder 봇 (구현)
     - Reviewer 봇 (리뷰)
     - Tester 봇 (테스트)
     - Docs 봇 (문서화)

2. **각 봇의 Token 저장**
   ```
   예시:
   - cokacnoye5bot: 8104401748:AAHd7...
   - cokacnoye2bot: 8799322953:AAFeLM...
   - cokacnoye3bot: 8373900303:AAHpow...
   - cokacnoye4bot: 8474373470:AAFDmh...
   - cokacnoye6bot: 8797985101:AAGsYT...
   ```

## 3단계: 그룹 채팅방 생성 및 Bot 초대

1. **Telegram 그룹 채팅방 생성**
2. **모든 봇을 그룹에 초대**
3. **그룹 채팅방 ID 확인**
   - 봇이 그룹에 메시지를 보내게 함
   - 로그에서 chat_id 확인 (음수, 예: -5268722950)

## 4단계: bot_settings.json 생성

```bash
# 디렉토리 확인
ls -la ~/.cokacdir/

# bot_settings.json 생성
nano ~/.cokacdir/bot_settings.json
```

**bot_settings.json 구조:**
```json
{
  "{BOT_TOKEN_HASH_1}": {
    "username": "cokacnoye2bot",
    "token": "8799322953:AAFeLM...",
    "instructions": {
      "-5268722950": "# Coder 인스트럭션\n\nCoder: Architect 지시대로 코드 작성...\n\n【CRITICAL】태스크 ID를 응답에 항상 포함하세요..."
    },
    "models": {
      "-5268722950": "claude:sonnet"
    },
    "last_sessions": {
      "-5268722950": "/home/cokac/.cokacdir/workspace/wtmphlpw"
    },
    "owner_user_id": 5839765127,
    "allowed_tools": {},
    "as_public_for_group_chat": {},
    "debug": false,
    "direct": {},
    "silent": {}
  },
  "{BOT_TOKEN_HASH_2}": {
    "username": "cokacnoye3bot",
    "token": "8373900303:AAHpow...",
    "instructions": {
      "-5268722950": "# Reviewer 인스트럭션\n\nReviewer: 코드 리뷰, 버그 탐지...\n\n【CRITICAL】태스크 ID를 응답에 항상 포함하세요..."
    },
    ...
  }
}
```

**Bot Token Hash 계산:**
```bash
echo -n "8799322953:AAFeLM..." | md5sum | cut -c1-16
# 결과: ce8025c6e399d9f0
```

## 5단계: orchestrator.js 설치

```bash
# lib 디렉토리 생성
mkdir -p ~/.cokacdir/lib

# orchestrator.js 복사 (기존 VPS에서)
# 또는 GitHub 등에서 파일 복사

# 권한 설정
chmod +x ~/.cokacdir/lib/orchestrator.js

# 설치 확인
node ~/.cokacdir/lib/orchestrator.js --help
```

## 6단계: 작업 공간 설정

```bash
# 작업 공간 디렉토리 생성
mkdir -p ~/workspace/project1
cd ~/workspace/project1

# orchestrator 세션 초기화
node ~/.cokacdir/lib/orchestrator.js init -5268722950 8104401748:AAHd7...
```

## 7단계: Bot 서버 시작

```bash
# 모든 봇 서버 시작
cokacdir --ccserver \
  8104401748:AAHd7... \
  8799322953:AAFeLM... \
  8373900303:AAHpow... \
  8474373470:AAFDmh... \
  8797985101:AAGsYT...

# 또는 백그라운드로 실행
nohup cokacdir --ccserver ... > ~/cokacdir_bots.log 2>&1 &
```

## 8단계: Orchestrator 모니터링 시작

```bash
cd ~/workspace/project1

# 모니터링 시작
node ~/.cokacdir/lib/orchestrator.js monitor

# 또는 백그라운드로 실행
nohup node ~/.cokacdir/lib/orchestrator.js monitor > orchestrator.log 2>&1 &
```

## 9단계: 테스트

그룹 채팅방에서 메시지 전송:
```
테스트: 간단한 계산 작업을 해줘
```

작동 확인:
1. Architect 봇이 요청 분석
2. Coder 봇에 작업 전달
3. Task ID가 응답에 포함되는지 확인

## 10단계: 서비스 등록 (선택)

```bash
# systemd 서비스 생성
sudo nano /etc/systemd/system/cokacdir-bots.service
```

```ini
[Unit]
Description=COKACDIR Telegram Bot Servers
After=network.target

[Service]
Type=simple
User=cokac
WorkingDirectory=/home/cokac/.cokacdir
ExecStart=/usr/local/bin/cokacdir --ccserver 8104401748:AAHd7... 8799322953:AAFeLM... 8373900303:AAHpow... 8474373470:AAFDmh... 8797985101:AAGsYT...
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 활성화
sudo systemctl enable cokacdir-bots
sudo systemctl start cokacdir-bots
```

---

## 필수 파일 백업 목록

새로운 VPS로 마이그레이션 시 필요한 파일:

```
~/.cokacdir/bot_settings.json          ← 봇 설정 (가장 중요!)
~/.cokacdir/lib/orchestrator.js        ← 오케스트레이터
~/.cokacdir/lib/.orchestrator-session.json  ← 세션 설정
/home/cokac/backup_cokacdir.sh         ← 백업 스크립트
/home/cokac/restore_cokacdir.sh        ← 복구 스크립트
```

## 간단 이동 방법

```bash
# 1. 기존 VPS에서 백업
cd ~ && tar czf cokacdir_setup.tar.gz \
  .cokacdir/bot_settings.json \
  .cokacdir/lib/orchestrator.js \
  backup_cokacdir.sh \
  restore_cokacdir.sh

# 2. 새 VPS로 전송
scp cokacdir_setup.tar.gz user@new-vps:~

# 3. 새 VPS에서 복원
cd ~
tar xzf cokacdir_setup.tar.gz

# 4. cokacdir 설치
/bin/bash -c "$(curl -fsSL https://cokacdir.cokac.com/install.sh)"

# 5. Bot 서버 시작
cokacdir --ccserver [토큰들...]
```
