# -*- coding: utf-8 -*-
import subprocess, os
os.chdir(r'D:\Code\card')

# 删除临时文件并修正提交
if os.path.exists('push_fix.py'):
    os.remove('push_fix.py')
subprocess.run(['git', 'rm', '--cached', 'push_fix.py'], capture_output=True)
subprocess.run(['git', 'add', '-A'])

msg = '修复部署：添加 .nojekyll，移除旧工作流'
with open('commit_msg.txt', 'wb') as f:
    f.write(msg.encode('utf-8'))

subprocess.run(['git', 'commit', '--amend', '--file=commit_msg.txt'], capture_output=True)
os.remove('commit_msg.txt')

# 推送到 GitHub（重试3次）
for i in range(3):
    print(f'Pushing to GitHub attempt {i+1}...')
    result = subprocess.run(['git', 'push', 'github', 'master', '--force'], capture_output=True)
    if result.returncode == 0:
        print('GitHub push SUCCESS!')
        break
    else:
        print('Failed:', result.stderr.decode('utf-8', errors='replace').strip())
        import time
        time.sleep(5)

# 推送到 Gitee
subprocess.run(['git', 'push', 'origin', 'master', '--force'], capture_output=True)
print('Gitee push done.')
