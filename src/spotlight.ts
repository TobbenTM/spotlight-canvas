
export class Spotlight {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    if (!canvas) throw new Error('No canvas element found!');

    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context!');

    this.context = ctx;
    this.resize();
    window.onresize = () => this.resize();
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.requestAnimationFrame(() => this.draw());
  }

  private draw() {
    if (!this.context) return;
    const minDimension = Math.min(this.canvas.width, this.canvas.height);
    const radius = minDimension * 1.2;
    const time = new Date();

    // Angle using seconds+milliseconds for easy testing:
    // const angle = ((Math.PI*2)/60)*(time.getSeconds()+time.getMilliseconds()*0.001);

    // Correct angle calculated using everything
    const angle = ((Math.PI*2)/12)*((time.getHours()%12) + (time.getMinutes() * (1/60)) + (time.getSeconds() * (1/60/60)));

    // Reset any transformations
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    // Fill background
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Translate so we only see the relevant part:
    // ..from the center..
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    // ..rotate in the direction of the hand angle..
    this.context.rotate(angle + Math.PI);
    // ..translate against the hand..
    this.context.translate(0, -(radius * 0.75));
    // ..then rotate back to normal
    this.context.rotate(-(angle + Math.PI));

    // Draw the parts
    this.drawTicks(this.context, radius);
    this.drawHand(this.context, radius, angle);

    // Queue a redraw
    window.requestAnimationFrame(() => this.draw());
  }

  // This draws all the ticks and numbers
  private drawTicks(ctx: CanvasRenderingContext2D, radius: number) {
    const fontSize = radius * 0.075;
    const fontPadding = radius * 0.005;

    const tickWidth = radius * 0.0035;
    const tickLength = radius * 0.035;
    const ticksPerHour = 6; // 5+1 ticks per hour
    const ticks = 12 * ticksPerHour; // 12 hours
    const angleIncrement = (Math.PI * 2) / ticks;

    ctx.fillStyle = 'white';
    ctx.font = `${fontSize}px 'Segoe UI', sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let i = 1; i < ticks + 1; i++) {

      // const angle = i * ((Math.PI * 2) / ticks);
      ctx.rotate(angleIncrement);

      if (i % ticksPerHour === 0) {
        // This is an hour tick; biggest size + text
        ctx.fillRect(-((tickWidth * 1.4) / 2), radius - (tickLength * 2), tickWidth * 1.4, tickLength * 2);

        // For the text we need to translate to where it's going to end up..
        ctx.translate(0, -(radius - tickLength * 2 - fontPadding - fontSize));
        // ..then rotate so the text gets the correct orientation..
        ctx.rotate(-angleIncrement * i);

        ctx.fillText(Math.floor(i / ticksPerHour).toString(), 0, 0);

        // ..and then back again
        ctx.rotate(angleIncrement * i);
        ctx.translate(0, radius - tickLength * 2 - fontPadding - fontSize);

      } else if (i % (ticksPerHour / 2) === 0) {
        // This is half an hour tick; second biggest tick
        ctx.fillRect(-((tickWidth * 1.1) / 2), radius - (tickLength * 1.5), tickWidth * 1.1, tickLength * 1.5);
      } else {
        // This is a normal tick
        ctx.fillRect(-(tickWidth/2), radius-(tickLength * 0.8), tickWidth, tickLength * 0.8);
      }
    }
  }

  // This draws the single orange hand
  private drawHand(ctx: CanvasRenderingContext2D, radius: number, angle: number) {
    const handWidth = radius * 0.0035;

    ctx.fillStyle = '#cc3600';
    ctx.rotate(angle);
    ctx.fillRect(-(handWidth/2), -radius*2, handWidth, radius*4)
    ctx.rotate(-angle);
  }
}
