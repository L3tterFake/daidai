import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="true"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap"
                        rel="stylesheet"
                    />

                </Head>
                <body><canvas id="canvas" class="canvas"></canvas>

<script>
window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// DPI FIX
let dpi = window.devicePixelRatio || 1;
context.scale(dpi, dpi);

function fix_dpi() {
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

    canvas.setAttribute("height", style_height * dpi);
    canvas.setAttribute("width", style_width * dpi);
}

var particle_count = 70,
    particles = [],
    couleurs = ["#3a0088", "#930077", "#e61c5d", "#ffbd39"];

function Particle() {
    this.radius = Math.random() * 3 + 5;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.color = couleurs[Math.floor(Math.random() * couleurs.length)];
    this.speedx = Math.random() * 2;
    this.speedy = Math.random() * 2;

    if (Math.random() > 0.5) this.speedx *= -1;
    if (Math.random() > 0.5) this.speedy *= -1;

    this.move = () => {
        context.beginPath();
        context.globalCompositeOperation = "source-over";
        context.fillStyle = this.color;
        context.globalAlpha = 1;
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();

        this.x += this.speedx;
        this.y += this.speedy;

        if (this.x <= this.radius || this.x >= canvas.width - this.radius) this.speedx *= -1;
        if (this.y <= this.radius || this.y >= canvas.height - this.radius) this.speedy *= -1;

        for (var j = 0; j < particle_count; j++) {
            let p2 = particles[j];
            let dx = p2.x - this.x;
            let dy = p2.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                context.beginPath();
                context.globalAlpha = (200 - dist) / 200;
                context.globalCompositeOperation = "destination-over";
                context.lineWidth = 1;
                context.moveTo(this.x, this.y);
                context.lineTo(p2.x, p2.y);
                context.strokeStyle = this.color;
                context.stroke();
            }
        }
    };
}

for (let i = 0; i < particle_count; i++) {
    fix_dpi();
    particles.push(new Particle());
}

function animate() {
    fix_dpi();
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.move());
    requestAnimFrame(animate);
}

animate();
</script>

                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}