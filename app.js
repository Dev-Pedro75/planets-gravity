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
  terra: 2.2,
  mercurio: 0.836,
  venus: 2.002,
  marte: 0.836,
  jupiter: 5.148,
  saturno: 2.3,
  urano: 2.024,
  netuno: 2.464,
  lua: 0.3652,
};
let confetti = new Confetti("update");
confetti.setCount(40);
confetti.setSize(1.5);
confetti.setPower(75);
confetti.setFade(true);
confetti.destroyTarget(false);

for (const planeta in gravityOptions) {
  gravityOptions[planeta] *= 0.3;
}

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
    if (this.y + this.radius + this.speed > canvas.height) {
      this.speed = ((-this.speed * 70) / 100) * this.friction;
      this.speedx = this.speedx * this.friction * 1.1;
    } else {
      this.speed += this.gravity;
    }

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.speedx = -this.speedx * this.friction * 1.1;
    }

    this.x += this.speedx;
    this.y += this.speed;
    this.colision();
    this.drawBox(x, y, width, height, color, radius, stroke);
  }
  up() {
    if (stopUp) {
      return;
    }
    setTimeout(() => {
      stopUp = true;
      setTimeout(() => {
        stopUp = false;
      }, 1 * 1000);
      this.text = true;
      this.speed = 5;
      this.gravity = -this.gravity;

      setTimeout(() => {
        this.text = false;
        this.gravity = -this.gravity;

        if (this.x >= (320 - this.radius) * 2) {
          this.speedx = getRandomInt(-5, -1);
        } else if (this.x >= (0 + this.radius) * 2) {
          this.speedx = getRandomInt(1, 5);
        } else {
          this.speedx = getRandomInt(-5, 5);
        }
      }, getRandomInt(180, 500));
    }, 100);
  }
  drawBox(x, y, width, height, color, radius, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = stroke;

    ctx.stroke();

    ctx.closePath();
  }
  colision() {
    boxs.forEach((circle) => {
      if (this.id == circle.id) {
        return;
      }
      var dx = this.x - circle.x;
      var dy = this.y - circle.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.radius + circle.radius) {
        this.stroke = "white";
        circle.stroke = "white";
      } else {
        this.stroke = this.originalColor;
      }
    });
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
  for (let i = 0; i < boxs.length; i++) {
    boxs[i].update(
      boxs[i].x,
      boxs[i].y,
      boxs[i].width,
      boxs[i].height,
      boxs[i].color,
      boxs[i].radius,
      boxs[i].stroke
    );
    if (boxs[i].text == true) {
      ctx.font = "2rem Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Reverse gravity!", canvas.width / 2, canvas.height / 2);
    }
  }
  window.requestAnimationFrame(main);
}

bt.addEventListener("click", () => {
  if (!amountBalls) {
    return;
  }
  if (amountBalls.value > 5000) {
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

invert.addEventListener("click", () => {
  boxs.forEach((item) => {
    item.up();
  });
});

main();
