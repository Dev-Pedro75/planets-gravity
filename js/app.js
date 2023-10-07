const canvas = document.querySelector("canvas");
const gravidadeInput = document.querySelector("#gravidade-input");
canvas.width = window.screen.width;
canvas.height = (50 * window.screen.height) / 100;
const ctx = canvas.getContext("2d");
let isUpdate = false;
let boxs = [];
let balls = 20;
const colors = [
  "#d1198b",
  "#03c2fc",
  "#e3243e",
  "#19d159",
  "#8b19d1",
  "#d19719",
];

const gravityOptions = {
  terra: 0.66,
  mercurio: 0.25079999999999997,
  venus: 0.6005999999999999,
  marte: 0.25079999999999997,
  jupiter: 1.5443999999999998,
  saturno: 0.69,
  urano: 0.6072,
  netuno: 0.7392,
  lua: 0.10956,
};
let confetti = new Confetti("update");
confetti.setCount(20);
confetti.setSize(1.2);
confetti.setPower(20);
confetti.setFade(true);
confetti.destroyTarget(false);

let pause = false;
const amountBalls = document.querySelector("#amount-balls");
const bt = document.querySelector("#update");
const invert = document.querySelector("#invert");
let stopUp = false;

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function draw(x, y, w, h, color) {
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h, color);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

amountBalls.addEventListener("input", () => {
  bt.classList.remove("yl");

  setTimeout(() => {
    bt.classList.add("yl");
    bt.textContent = "Update Values";
  }, 50);
});

class Box {
  constructor() {
    this.id = Math.random() + Math.random();
    this.x = getRandomInt(20, canvas.width - 20);
    this.y = getRandomInt(0, 20);
    this.width = getRandomInt(-10, -13);
    this.height = this.width;
    this.color = randomColor(colors);
    this.originalColor = this.color;
    this.gravity = gravityOptions.terra;
    this.stroke = this.color;
    this.speed = getRandomInt(-3, 3);
    this.speedx = getRandomInt(-2, 2);
    this.text = false;
    this.friction = 0.8;
    this.radius = getRandomInt(5, 10);
  }
  update(x, y, width, height, color, radius, stroke) {
    const radiusPlusSpeed = this.radius + this.speed;
    const frictionTimes1_1 = this.friction * 1.1;
    const isOutsideHorizontalBounds =
      this.x + this.radius > canvas.width || this.x - this.radius < 0;
    const isBelowCanvasHeight = this.y + radiusPlusSpeed > canvas.height;

    if (isBelowCanvasHeight) {
      this.speed = ((-this.speed * 70) / 100) * this.friction;
      this.speedx *= frictionTimes1_1;
    } else {
      this.speed += this.gravity;
    }

    if (isOutsideHorizontalBounds) {
      this.speedx = -this.speedx * frictionTimes1_1;
    }

    this.x += this.speedx;
    this.y += this.speed;
    this.drawBox(x, y, width, height, color, radius, stroke);
  }
  up() {
    if (stopUp) {
      return;
    }
    const updateProperties = () => {
      stopUp = true;
      setTimeout(() => {
        stopUp = false;
      }, 1000);
      this.text = true;
      this.speed = 5;
      this.gravity = -this.gravity;

      setTimeout(() => {
        this.text = false;
        this.gravity = -this.gravity;

        const minX = (0 + this.radius) * 2;
        const maxX = (320 - this.radius) * 2;

        if (this.x >= maxX) {
          this.speedx = getRandomInt(-5, -1);
        } else if (this.x >= minX) {
          this.speedx = getRandomInt(1, 5);
        } else {
          this.speedx = getRandomInt(-5, 5);
        }
      }, getRandomInt(180, 500));
    };

    setTimeout(updateProperties, 100);
  }
  drawBox(x, y, width, height, color, radius, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = stroke;

    ctx.stroke();
    this.stroke = "white";
    ctx.closePath();
  }
}

function drawStage() {
  draw(0, 0, canvas.width, canvas.height, "#525c6b");
}

for (let i = 0; i < balls; i++) {
  boxs.push(new Box());
}

function main() {
  if (pause) {
    return;
  }

  drawStage();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ctx = canvas.getContext("2d");

  for (let i = 0; i < boxs.length; i++) {
    const box = boxs[i];
    const { x, y, width, height, color, radius, stroke, text } = box;

    box.update(x, y, width, height, color, radius, stroke);

    if (text) {
      ctx.font = "2rem Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Reverse gravity!", canvasWidth / 2, canvasHeight / 2);
    }
  }

  window.requestAnimationFrame(main);
}

bt.addEventListener("click", () => {
  if (!amountBalls) {
    return;
  }
  if (amountBalls.value > 8000) {
    alert(
      "Esse valor é muito alto e pode causar travamentos, escolha um menor!"
    );
    return;
  }
  bt.textContent = "Restart";
  bt.classList.remove("yl");
  pause = true;
  balls = amountBalls.value;
  boxs.length = 0;
  for (let i = 0; i < balls; i++) {
    boxs.push(new Box());
    boxs[i].gravity = gravityOptions[gravidadeInput.value];
  }
  pause = false;
});

gravidadeInput.addEventListener("change", () => {
  bt.classList.remove("yl");

  setTimeout(() => {
    bt.classList.add("yl");
    bt.textContent = "Update Values";
  }, 50);
});

invert.addEventListener("click", () => {
  boxs.forEach((item) => {
    item.up();
  });
});

main();
