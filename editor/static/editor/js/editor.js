// editor/static/editor/js/editor.js
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let img      = new Image();
let rect     = { x:50, y:50, w:200, h:200, dragging:false, resizing:false, anchorSize:10 };

// プレビュー＆初期枠表示
document.getElementById('id_original').addEventListener('change', e => {
  img.src = URL.createObjectURL(e.target.files[0]);
  img.onload = () => {
    canvas.width  = img.width;
    canvas.height = img.height;
    drawCanvas();
  };
});

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.strokeStyle = 'red';
  ctx.lineWidth   = 2;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle   = 'blue';
  ctx.fillRect(
    rect.x + rect.w - rect.anchorSize,
    rect.y + rect.h - rect.anchorSize,
    rect.anchorSize, rect.anchorSize
  );
}

// ドラッグ＆リサイズ
canvas.addEventListener('mousedown', e => {
  const x = e.offsetX, y = e.offsetY;
  if (x >= rect.x + rect.w - rect.anchorSize && y >= rect.y + rect.h - rect.anchorSize) {
    rect.resizing = true;
  } else if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
    rect.dragging  = true;
    rect.offsetX  = x - rect.x;
    rect.offsetY  = y - rect.y;
  }
});
canvas.addEventListener('mousemove', e => {
  if (!rect.dragging && !rect.resizing) return;
  const x = e.offsetX, y = e.offsetY;
  if (rect.resizing) {
    rect.w = x - rect.x;
    rect.h = y - rect.y;
  } else {
    rect.x = x - rect.offsetX;
    rect.y = y - rect.offsetY;
  }
  drawCanvas();
});
canvas.addEventListener('mouseup', () => {
  rect.dragging = rect.resizing = false;
});

// 保存 → フルキャンバス送信＆一覧へリダイレクト
document.getElementById('save-btn').addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');  // :contentReference[oaicite:4]{index=4}
  fetch('/editor/save/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': CSRF_TOKEN             // Django CSRF トークン
    },
    body: JSON.stringify({ image: dataURL })
  })
  .then(res => res.json())
  .then(() => window.location.href = '/editor/list');
});
