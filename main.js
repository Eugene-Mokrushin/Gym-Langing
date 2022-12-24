const defaultCollision = 0x0001
const normalHeight = 929
const normalWidth = 1920

let engine;
let world;
let render;

function generateCanvas() {

    const isVertical = window.innerHeight < window.innerWidth ? false : true

    engine = Matter.Engine.create()
    world = engine.world
    render = Matter.Render.create({
        element: document.querySelector('#world'),
        engine: engine,
        options: {
            width: window.innerWidth,
            height: document.querySelector('#world').offsetHeight,
            wireframes: false,
            background: "none"
        },
    })

    let vwC = document.documentElement.clientWidth;
    let scale = 1;
    let vhC = document.documentElement.clientHeight;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        scale = vwC / normalWidth <= vhC / normalHeight ? vwC / normalWidth : vhC / normalHeight
        scale = scale > 1.2 ? 1.2 : scale
        scale = scale < 0.4 ? 0.4 : scale
    } else {
        scale = vwC / normalWidth <= vhC / normalHeight ? vwC / normalWidth : vhC / normalHeight
        scale = scale > 1.2 ? 1.2 : scale
    }


    const screenCenter = window.innerWidth / 2

    let sCircle = Matter.Bodies.circle(screenCenter, 130, 10 * scale, {
        render: {
            fillStyle: '#895129',
            strokeStyle: "#140500",
            lineWidth: 10 * scale
        },
    })

    let sizeY = 150,
        sizeX = 18,
        y = 200,
        partA = Matter.Bodies.rectangle(screenCenter - 95, y + 74, sizeX, sizeY, {
            chamfer: { radius: [0, 20, 0, 20] },
            render: {
                fillStyle: '#895129',
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
        }),
        partB = Matter.Bodies.rectangle(screenCenter + 95, y + 74, sizeX, sizeY, {
            chamfer: { radius: [20, 0, 20, 0] },
            render: {
                fillStyle: '#895129',
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
        }),
        partC = Matter.Bodies.circle(screenCenter + 119, 195, 30 * scale, {
            render: {
                fillStyle: "#9f633c",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
        }),
        partD = Matter.Bodies.circle(screenCenter - 119, 195, 30 * scale, {
            render: {
                fillStyle: "#9f633c",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
        }),
        partF = Matter.Bodies.rectangle(screenCenter + 80, 360, 20, 10, {
            render: {
                fillStyle: "#554542",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
        }),
        partE = Matter.Bodies.rectangle(screenCenter - 80, 360, 20, 10, {
            render: {
                fillStyle: "#554542",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },

        }),
        decorA = Matter.Bodies.rectangle(screenCenter, 250, 200, 30, {
            render: {
                fillStyle: "#553219",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
        }),
        decorB = Matter.Bodies.circle(screenCenter + 119, 195, 20 * scale, {
            render: {
                fillStyle: "#7b4824",
                strokeStyle: "#140500",
                lineWidth: 7 * scale
            },
        }),
        decorC = Matter.Bodies.circle(screenCenter - 119, 195, 20 * scale, {
            render: {
                fillStyle: "#7b4824",
                strokeStyle: "#140500",
                lineWidth: 7 * scale
            },
        }),
        chair = Matter.Bodies.rectangle(screenCenter, 200, 200, 300, {
            render: {
                fillStyle: "#9f633c",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            },
            chamfer: { radius: [35, 35, 10, 10] }
        })

    let compoundBodyA = Matter.Body.create({
        parts: [chair, sCircle, decorA, partA, partB, partC, decorB, partD, decorC, partF, partE],
        restitution: 0.5,
        friction: 0.9,
        mass: 10,
    });
    const rightSideOfChair = partC.position.x + partC.circleRadius / 2
    const leftSideOfChair = partD.position.x + partD.circleRadius / 2

    Matter.Body.setPosition(compoundBodyA, { x: screenCenter, y: document.querySelector('#world').offsetHeight - 300 * scale })
    // Matter.Body.rotate(compoundBodyA, Math.PI / 10)
    Matter.Body.scale(compoundBodyA, scale, scale)
    let lampA = Matter.Bodies.trapezoid(rightSideOfChair + 100 * scale, 200, 50, 100, -1, {
        render: {
            fillStyle: "#ffb540",
            strokeStyle: "#140500",
            lineWidth: 10 * scale
        }
    }),
        lampB = Matter.Bodies.rectangle(rightSideOfChair + 100 * scale, 400, 10, 300, {
            render: {
                fillStyle: "#e0e0e0",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            }
        }),
        lampC = Matter.Bodies.rectangle(rightSideOfChair + 100 * scale, 560, 100, 15, {
            render: {
                fillStyle: "#adadad",
                strokeStyle: "#140500",
                lineWidth: 10 * scale
            }
        })

    Matter.Body.rotate(lampA, Math.PI)

    let compoundBodyB = Matter.Body.create({
        parts: [lampB, lampA, lampC],
        friction: 0.9,
        mass: 100
    })
    Matter.Body.setCentre(compoundBodyB, { x: (lampB.bounds.max.x + lampB.bounds.min.x) / 2, y: (lampB.bounds.max.y + lampB.bounds.min.y) / 2 })
    Matter.Body.setPosition(compoundBodyB, { x: rightSideOfChair + 100 * scale, y: document.querySelector('#world').offsetHeight - 300 * scale })
    Matter.Body.scale(compoundBodyB, scale, scale)
    let cabinet = Matter.Bodies.rectangle(leftSideOfChair - 100 * scale, document.querySelector('#world').offsetHeight - 200, 150, 130, {
        render: {
            sprite: {
                texture: '/images/cabinet.svg',
                xScale: scale,
                yScale: scale
            }
        },
        friction: 1,
        mass: 50
    })
    Matter.Body.setPosition(cabinet, { x: leftSideOfChair - 100 * scale, y: document.querySelector('#world').offsetHeight - 200 * scale })
    Matter.Body.scale(cabinet, scale, scale)
    engine.gravity.y = 3

    ///////

    let center = {};    // Center Points
    center.x = screenCenter;
    center.y = document.querySelector('#world').offsetHeight;

    let radius = cabinet.bounds.min.x > 700 ? 700 : cabinet.bounds.min.x     // Radius
    radius = radius < 450 ? 450 : radius
    const amountOfElements = DATA_Diplomas.allSmallDiplomas.length + 3;    // Amount of Elements

    function getPos(center, rad, amount, iteration) {
        let degree = 180 / amount * iteration;

        let changeY = center.y - (Math.sin(degree * Math.PI / 180) * rad);
        let changeX = center.x - (Math.cos(degree * Math.PI / 180) * rad);

        let ret = {};
        ret.x = Math.round(changeX * 100) / 100;
        ret.y = Math.round(changeY * 100) / 100;

        return ret;
    }

    let coordinates = []
    for (let i = 0; i < amountOfElements; i++) {
        coordinates.push(getPos(center, radius, amountOfElements, i))
    }

    ///////
    let allConstraints = []
    const scaleDeterminer = scale > 0.7 ? scale : 0.7
    let leftDiplomas
    if (window.innerWidth >= 870) {
        DATA_Diplomas.allSmallDiplomas.forEach(async (diploma, indexDiploma) => {

            const img = new Image();

            img.src = `/Diplomas/${diploma}`
            let imgSize = [img.naturalWidth, img.naturalHeight]

            const constLabel1 = indexDiploma + "A"
            const constLabel2 = indexDiploma + "B"

            allConstraints.push(constLabel1, constLabel2)

            const xCoord = coordinates[indexDiploma + 2].x
            const yCoord = coordinates[indexDiploma + 2].y > 100 ? coordinates[indexDiploma + 2].y : 100

            const nail = yCoord - (70 * scaleDeterminer) > 0 ? yCoord - (70 * scaleDeterminer) : 20

            let diplomaBody = Matter.Bodies.rectangle(xCoord, yCoord, imgSize[0], imgSize[1], {
                render: {
                    sprite: {
                        texture: img.src,
                        xScale: scaleDeterminer,
                        yScale: scaleDeterminer
                    }
                },
                label: diploma.split('_')[0] + '.jpg'
            })
            Matter.Body.scale(diplomaBody, scaleDeterminer, scaleDeterminer)

            const constraintA = Matter.Constraint.create({
                pointA: { x: xCoord, y: nail },
                bodyB: diplomaBody,
                pointB: { x: (-1 * ((imgSize[0] / 2) - 5)) * scaleDeterminer, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleDeterminer },

                render: {
                    type: "line",
                    strokeStyle: "#9f633c",
                    anchors: true
                },
                label: constLabel1
            })

            // Matter.Constraint
            // Matter.Events.on(constraintA, "tick", () => {
            //     console.log('a')
            // })
            const constraintB = Matter.Constraint.create({
                pointA: { x: xCoord, y: nail },
                bodyB: diplomaBody,
                pointB: { x: ((imgSize[0] / 2) - 5) * scaleDeterminer, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleDeterminer },

                render: {
                    type: "line",
                    strokeStyle: "#9f633c"
                },
                label: constLabel2
            })
            Matter.World.add(world, [constraintA, constraintB, diplomaBody])
        })
    } else if (window.innerWidth < 870 && window.innerWidth > 600) {
        const frameX = screenCenter / 1.5
        const frameY = document.querySelector('#world').offsetHeight / 4
        const gap = 200 * scaleDeterminer
        let prevImage = 0
        DATA_Diplomas.allSmallDiplomas.forEach((diploma, indexDiploma) => {

            if (indexDiploma < 4) {
                const delim = indexDiploma % 2 === 0 ? 1 : 0
                const directX = indexDiploma % 2 === 0 ? -1 : 1

                const img = new Image();
                img.src = `/Diplomas/${diploma}`
                let imgSize = [img.naturalWidth, img.naturalHeight]

                prevImage = (indexDiploma === 0 || indexDiploma === 1) ? imgSize[1] : 0

                let secondRow = indexDiploma !== 0 || indexDiploma !== 1 ? prevImage : 0
                const directY = indexDiploma === 0 || indexDiploma === 1 ? 0 : gap + secondRow

                let diplomaBody = Matter.Bodies.rectangle((frameX - ((gap) * directX) - (delim * imgSize[0])), (frameY + directY), imgSize[0], imgSize[1], {
                    render: {
                        sprite: {
                            texture: img.src,
                            xScale: scaleDeterminer,
                            yScale: scaleDeterminer
                        }
                    },
                    label: diploma.split('_')[0] + '.jpg'
                })
                const constraintA = Matter.Constraint.create({
                    pointA: { x: (frameX - ((gap) * directX) - (delim * imgSize[0])), y: frameY + directY - 50 },
                    bodyB: diplomaBody,
                    pointB: { x: (-1 * ((imgSize[0] / 2) - 5)) * scaleDeterminer, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleDeterminer },

                    render: {
                        type: "line",
                        strokeStyle: "#9f633c"
                    }
                })
                const constraintB = Matter.Constraint.create({
                    pointA: { x: (frameX - ((gap) * directX) - (delim * imgSize[0])), y: frameY + directY - 50 },
                    bodyB: diplomaBody,
                    pointB: { x: ((imgSize[0] / 2) - 5) * scaleDeterminer, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleDeterminer },

                    render: {
                        type: "line",
                        strokeStyle: "#9f633c"
                    }
                })


                Matter.Body.scale(diplomaBody, scaleDeterminer, scaleDeterminer)
                Matter.World.add(world, [diplomaBody, constraintA, constraintB])
            } else if (indexDiploma >= 4) {
                const delim = indexDiploma % 2 === 0 ? 1 : 0
                const directX = indexDiploma % 2 === 0 ? -1 : 1

                const img = new Image();
                img.src = `/Diplomas/${diploma}`
                let imgSize = [img.naturalWidth, img.naturalHeight]

                prevImage = (indexDiploma === 4 || indexDiploma === 5) ? imgSize[1] : 0

                let secondRow = indexDiploma !== 4 || indexDiploma !== 5 ? prevImage : 0
                const directY = indexDiploma === 4 || indexDiploma === 5 ? 0 : gap + secondRow

                let diplomaBody = Matter.Bodies.rectangle(screenCenter + (frameX - ((gap) * directX) - (delim * imgSize[0])), (frameY + directY), imgSize[0], imgSize[1], {
                    render: {
                        sprite: {
                            texture: img.src,
                            xScale: scaleDeterminer,
                            yScale: scaleDeterminer
                        }
                    },
                    label: diploma.split('_')[0] + '.jpg'
                })
                const constraintA = Matter.Constraint.create({
                    pointA: { x: screenCenter + (frameX - ((gap) * directX) - (delim * imgSize[0])), y: frameY + directY - 50 },
                    bodyB: diplomaBody,
                    pointB: { x: (-1 * ((imgSize[0] / 2) - 5)) * scaleDeterminer, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleDeterminer },

                    render: {
                        type: "line",
                        strokeStyle: "#9f633c"
                    }
                })
                const constraintB = Matter.Constraint.create({
                    pointA: { x: screenCenter + (frameX - ((gap) * directX) - (delim * imgSize[0])), y: frameY + directY - 50 },
                    bodyB: diplomaBody,
                    pointB: { x: ((imgSize[0] / 2) - 5) * scaleDeterminer, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleDeterminer },

                    render: {
                        type: "line",
                        strokeStyle: "#9f633c"
                    }
                })
                Matter.Body.scale(diplomaBody, scaleDeterminer, scaleDeterminer)
                Matter.World.add(world, [diplomaBody, constraintA, constraintB])
            }
        })

    } else if (window.innerWidth <= 600) {
        let prevImageHeight = 0
        let paddingY = 10
        DATA_Diplomas.allSmallDiplomas.forEach((diploma, indexDiploma) => {
            const img = new Image();
            img.src = `/Diplomas/${diploma}`
            let imgSize = [img.naturalWidth, img.naturalHeight]

            const scaleRow = scale < 0.5 ? 0.6 : scaleDeterminer
            const paddingX = indexDiploma % 2 === 0 ? 150 * scaleRow : window.innerWidth - (150 * scaleRow)
            paddingY = indexDiploma % 2 === 0 ? paddingY + 100 * scaleRow + prevImageHeight / 2 : paddingY

            let diplomaBody = Matter.Bodies.rectangle(paddingX, paddingY, imgSize[0], imgSize[1], {
                render: {
                    sprite: {
                        texture: img.src,
                        xScale: scaleRow,
                        yScale: scaleRow
                    }
                },
                label: diploma.split('_')[0] + '.jpg'
            })

            const constraintA = Matter.Constraint.create({
                pointA: { x: paddingX, y: paddingY - 50 },
                bodyB: diplomaBody,
                pointB: { x: (-1 * ((imgSize[0] / 2) - 5)) * scaleRow, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleRow },

                render: {
                    type: "line",
                    strokeStyle: "#9f633c"
                }


            })

            if (constraintA.length > 50) {
                render.anchors = false;
            }

            const constraintB = Matter.Constraint.create({
                pointA: { x: paddingX, y: paddingY - 50 },
                bodyB: diplomaBody,
                pointB: { x: ((imgSize[0] / 2) - 5) * scaleRow, y: (-1 * ((imgSize[1] / 2) - 5)) * scaleRow },

                render: {
                    type: "line",
                    strokeStyle: "#9f633c"
                }
            })


            prevImageHeight = imgSize[1]

            Matter.Body.scale(diplomaBody, scaleRow, scaleRow)
            Matter.World.add(world, [diplomaBody, constraintA, constraintB])
        })
    }

    let ground = Matter.Bodies.rectangle(window.innerWidth / 2, document.querySelector('#world').offsetHeight + 23, window.innerWidth, 50, { isStatic: true, collisionFilter: { category: defaultCollision } })

    let mouse = Matter.Mouse.create(render.canvas);
    let mouseConstrain = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            angularStiffness: 0,
            render: { visible: false }
        }
    })


    const chairWidth = compoundBodyA.bounds.max.x - compoundBodyA.bounds.min.x
    render.mouse = mouse;

    // let a = Matter.Composite.allConstraints(world)

    // // console.log(a)

    // Matter.Events.on(engine, "afterUpdate", () => {

    //     a.forEach(constraint => {
    //         // constraint.length += 1
    //         console.log(constraint)
    //         // if (constraint.rest.length > 50) {
    //         //     Matter.Composite.remove(world, constraint)
    //         // }
    //     })
    // })
    let allBodies = Matter.Composite.allBodies(world).map(body => body.label)

    Matter.Events.on(mouseConstrain, "enddrag", (e) => {
        if (allBodies.includes(e.body.label)) {
            document.querySelector('#fullDiplomaPicture').src = `/Diplomas/${e.body.label}`
            document.querySelector('#diploma').style.display = "initial"
        }
    })

    if (isMobile && screen.orientation.type === "landscape-primary") {
        Matter.World.add(world, [ground, mouseConstrain])
    } else if (window.innerWidth < 870) {
        Matter.Body.setPosition(compoundBodyA, { x: screenCenter - chairWidth * scale, y: document.querySelector('#world').offsetHeight - 200 * scale })
        Matter.Body.setPosition(compoundBodyB, { x: screenCenter + chairWidth * scale, y: document.querySelector('#world').offsetHeight - 300 * scale })
        Matter.World.add(world, [ground, compoundBodyA, compoundBodyB, mouseConstrain])
    } else {
        Matter.World.add(world, [ground, compoundBodyA, compoundBodyB, cabinet, mouseConstrain])
    }
    // Matter.World.add(world, [ground, compoundBodyA, compoundBodyB, cabinet, mouseConstrain])
    Matter.Runner.run(engine)
    Matter.Render.run(render)
}