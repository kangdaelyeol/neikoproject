class drawServices {
  constructor(ctx) {
    this.ctx = ctx;
  }

  drawRect = (option) => {
    this.ctx.save();
    const rect = new Path2D();
    rect.rect(option.x, option.y, option.width, option.height);
    this.ctx.fillStyle = 'wheat';
    this.ctx.fill(rect);
    this.ctx.restore();
  };

  // option - x, y, textAlign, fontSize, fontFamily, text : Object
  drawText = (option) => {
    this.ctx.save();
    this.ctx.font = `${option.fontSize} ${option.fontFamily}`;
    this.ctx.strokeStyle = 'black';
    this.ctx.textAlign = option.textAlign;
    if (option.baseLine) this.ctx.textBaseline = option.baseLine;
    this.ctx.strokeText(option.text, option.x, option.y);
    this.ctx.restore();
  };

  // option - moveX/Y, lineX/Y, strokeStyle, lineWidth, dash
  drawLine = (option) => {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.lineWidth = option.lineWidth;
    this.ctx.moveTo(option.moveX, option.moveY);
    this.ctx.lineTo(option.lineX, option.lineY);
    this.ctx.strokeStyle = option.strokeStyle;
    if (option.dash) this.ctx.setLineDash([5, 5]);
    this.ctx.stroke();
    this.ctx.restore();
  };

  // option - x ,y radius, color
  drawCircle = (option, elements) => {
    let id = 0;
    this.ctx.save();
    this.ctx.beginPath();
    const circle = new Path2D();
    circle.arc(option.x, option.y, option.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = option.color;
    this.ctx.fill(circle);

    // 이벤트 추가를 위한 식별자 생성
    const element = {
      kind: 'circle',
      x: option.x,
      y: option.y,
      radius: option.radius,
      element: circle,
      id,
    };
    id++;
    elements.push(element);

    this.ctx.restore();
  };
}

export default drawServices;
