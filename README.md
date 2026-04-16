# LPM Portable Studio — Working Product Foundation

This package is focused on the working product, not future wording.

## What works in this version
- Start a new project
- Continue an earlier project from the same browser
- Built-in readiness check
- Built-in demo/test mode
- Upload a song
- Send the song to the server for lyric extraction
- Review and edit lyrics
- Choose background scene
- Choose lyric style
- Save project state in the browser library
- Resume later in the same browser

## What is intentionally not finished yet
- Final MP4 render engine
- User accounts
- Cloud project library shared across devices

## Important
To make lyric extraction work live, add OPENAI_API_KEY in Render.

## Local run
1. Install Node 18+
2. npm install
3. npm start
4. Open http://localhost:3000

## Render
1. Put this folder in GitHub
2. Connect repo to Render
3. Add OPENAI_API_KEY
4. Deploy

## Test data included
- public/test-data/Sample_Test_Audio_Clear_Vocals.wav
- public/test-data/Sample_Test_Lyrics.txt
