'use client'
import React, { useCallback } from 'react'
import Particles from 'react-particles';
import { Container, Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

const deg = Math.PI / 180;

function snowflake(c: CanvasRenderingContext2D, n: number, len: number) {
    c.save();
    leg(n);
    c.rotate(-120 * deg);
    leg(n);
    c.rotate(-120 * deg);
    leg(n);
    c.closePath();
    c.restore();

    function leg(n: number) {
        c.save();
        if (n === 0) {
            c.lineTo(len, 0);
        } else {
            c.scale(1 / 3, 1 / 3);
            leg(n - 1);
            c.rotate(60 * deg);
            leg(n - 1);
            c.rotate(-120 * deg);
            leg(n - 1);
            c.rotate(60 * deg);
            leg(n - 1);
        }
        c.restore();
        c.translate(len, 0);
    }
}

export default function SnowFlakes() {
    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);

        // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        engine.addShape("snowflake", function (context, particle, radius) {
            snowflake(context, Math.floor(Math.random() * 3 + 2), radius);
        });
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        console.log(container);
    }, []);
    return (
        <Particles
            id="snowflakes"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: "#fff",
                    opacity:0,
                },
                fpsLimit: 120,
                particles: {
                    color: {
                        value: "#87ceeb"
                    },
                    move: {
                        direction: "bottom",
                        enable: true,
                        outModes: "out",
                        speed: 2
                    },
                    number: {
                        density: {
                            enable: false,
                            area: 800
                        },
                        value: 70
                    },
                    opacity: {
                        value: 0.5
                    },
                    shape: {
                        type: "snowflake",
                    },
                    size: {
                        value: 30
                    },
                    wobble: {
                        enable: true,
                        distance: 10,
                        speed: 10
                    },
                    zIndex: {
                        value: {
                            min: 0,
                            max: 100
                        }
                    }
                },
                detectRetina:true
            }}
        />
    )
}
