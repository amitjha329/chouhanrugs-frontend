'use client'
import React, { useCallback } from 'react'
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import { Container, Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

const deg = Math.PI / 180;

export default function Fireworks() {
    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);
        await loadFull(engine)
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        console.log(container);
        setTimeout(() => {
            container?.stop()
        }, 10000)
    }, []);
    return (
        <Particles
            id="fireworks"
            init={particlesInit}
            loaded={particlesLoaded}
            options={
                {
                    detectRetina: true,
                    background: {
                        color: "#fff",
                        opacity: 0
                    },
                    fpsLimit: 120,
                    emitters: {
                        direction: "top",
                        life: {
                            count: 0,
                            duration: 0.1,
                            delay: 0.1
                        },
                        rate: {
                            delay: 0.01,
                            quantity: 1
                        },
                        size: {
                            width: 100,
                            height: 0
                        },
                        position: {
                            y: 100,
                            x: 50
                        }
                    },
                    particles: {
                        number: {
                            density: {
                                enable: true,
                                height: 20,
                            }
                        },
                        destroy: {
                            mode: "split",
                            split: {
                                count: 1,
                                factor: { value: 1 },
                                rate: {
                                    value: 20
                                },
                                particles: {
                                    color: {
                                        value: ["#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921"]
                                    },
                                    stroke: {
                                        width: 0
                                    },
                                    number: {
                                        value: 0
                                    },
                                    collisions: {
                                        enable: false
                                    },
                                    opacity: {
                                        value: 1,
                                        animation: {
                                            enable: true,
                                            speed: 0.6,
                                            minimumValue: 0.1,
                                            sync: false,
                                            startValue: "max",
                                            destroy: "min"
                                        }
                                    },
                                    shape: {
                                        type: "circle"
                                    },
                                    size: {
                                        value: { min: 2, max: 3 },
                                        animation: {
                                            enable: false
                                        }
                                    },
                                    life: {
                                        count: 1,
                                        duration: {
                                            value: {
                                                min: 1,
                                                max: 2
                                            }
                                        }
                                    },
                                    move: {
                                        enable: true,
                                        gravity: {
                                            enable: false
                                        },
                                        speed: 2,
                                        direction: "none",
                                        random: true,
                                        straight: false,
                                        outMode: "destroy"
                                    }
                                }
                            }
                        },
                        life: {
                            count: 1
                        },
                        shape: {
                            type: "line"
                        },
                        size: {
                            value: { min: 1, max: 100 },
                            animation: {
                                enable: true,
                                sync: true,
                                speed: 150,
                                startValue: "random",
                                destroy: "min"
                            }
                        },
                        stroke: {
                            color: {
                                value: "#ffac00"
                            },
                            width: 1
                        },
                        rotate: {
                            path: true
                        },
                        move: {
                            enable: true,
                            gravity: {
                                acceleration: 15,
                                enable: true,
                                inverse: true,
                                maxSpeed: 100
                            },
                            speed: { min: 10, max: 20 },
                            outModes: {
                                default: "destroy",
                                top: "none"
                            },
                        }
                    }
                }
            }
        />
    )
}
