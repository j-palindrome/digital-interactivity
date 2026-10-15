import os, sys, shutil, zipfile, re, subprocess, json, urllib.request, ssl

BASE_DIR = os.path.abspath('students')
TMP_DIR = '/tmp/sketch_final'
if os.path.exists(TMP_DIR):
    shutil.rmtree(TMP_DIR)
os.makedirs(TMP_DIR, exist_ok=True)

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

def sanitize_name(name):
    # remove # and replace spaces with underscores, collapse multiple underscores
    s = name.replace('#', '')
    s = re.sub(r'[\s]+', '_', s)
    s = re.sub(r'_+', '_', s)
    s = s.strip('_')
    return s

def clean_tree_filenames(target_dir):
    """Walk target_dir bottom-up and rename files/dirs to remove spaces and #."""
    for root, dirs, files in os.walk(target_dir, topdown=False):
        for f in files:
            sanitized = sanitize_name(f)
            if sanitized != f:
                old_p = os.path.join(root, f)
                new_p = os.path.join(root, sanitized)
                if old_p != new_p:
                    os.rename(old_p, new_p)
        for d in dirs:
            sanitized = sanitize_name(d)
            if sanitized != d:
                old_p = os.path.join(root, d)
                new_p = os.path.join(root, sanitized)
                if old_p != new_p:
                    os.rename(old_p, new_p)

def clean_sketch_name(name):
    # e.g. "animation_1_(complete)_2026_10_13_14_06_34" -> "animation_1_complete"
    # or "sketch 1_2026_10_13_14_31_24" -> "sketch_1"
    # or "KeyH_2026_10_13_14_03_54" -> "KeyH"
    base = os.path.splitext(name)[0]
    base = re.sub(r'_\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}', '', base)
    base = re.sub(r'\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}', '', base)
    base = base.replace('(', '').replace(')', '')
    base = sanitize_name(base)
    return base

def download_drive_file(file_id, out_path):
    if os.path.exists(out_path):
        return out_path
    cmd = ['gog', 'drive', 'download', file_id, '--out', out_path, '--force']
    subprocess.run(cmd, check=True, capture_output=True)
    return out_path

def download_drive_folder(folder_id, target_dir):
    os.makedirs(target_dir, exist_ok=True)
    res = subprocess.run(['gog', 'drive', 'ls', '--parent', folder_id, '--max', '100', '--json'],
                         check=True, capture_output=True, text=True)
    files = json.loads(res.stdout).get('files', [])
    for f in files:
        fname = f['name']
        fid = f['id']
        mtype = f.get('mimeType', '')
        if mtype == 'application/vnd.google-apps.folder':
            download_drive_folder(fid, os.path.join(target_dir, fname))
        else:
            download_drive_file(fid, os.path.join(target_dir, fname))

def download_p5js_project(project_id, target_dir, username=None):
    os.makedirs(target_dir, exist_ok=True)
    u = f'https://editor.p5js.org/editor/projects/{project_id}'
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ssl_ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except Exception:
        if username:
            u = f'https://editor.p5js.org/editor/{username}/projects'
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, context=ssl_ctx) as resp:
                all_p = json.loads(resp.read().decode('utf-8')).get('projects', [])
                data = next((p for p in all_p if p.get('id') == project_id), None)
                if not data:
                    raise RuntimeError(f"Could not find project {project_id} under {username}")
        else:
            raise

    for f in data.get('files', []):
        fname = f['name']
        ftype = f.get('fileType', 'file')
        if ftype == 'folder':
            continue
        fcontent = f.get('content', '')
        furl = f.get('url')
        out_f = os.path.join(target_dir, fname)
        if furl:
            req_asset = urllib.request.Request(furl, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_asset, context=ssl_ctx) as a_resp:
                with open(out_f, 'wb') as out_bin:
                    out_bin.write(a_resp.read())
        else:
            with open(out_f, 'w', encoding='utf-8') as out_txt:
                out_txt.write(fcontent)

print("organize_final base ready")
