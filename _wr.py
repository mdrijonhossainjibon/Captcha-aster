import os
lines=[
  "hello",
  "world",
]
with open('app/api/topup/history/route.ts', 'w') as f:
    f.write(chr(10).join(lines))
print('ok')