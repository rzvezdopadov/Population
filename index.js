let model = {
	renderFrame: 50,
	clientMinX: 0,
	clientMinY: 0,
	clientMaxX: 700,
	clientMaxY: 1500,
	customSizeBacteria:  7,
	customCycleNotReproduction: 500,
	bacteria: [],
	baseBacteria: function (posX, posY, speedX, speedY, routeMove, type, health, cycleNotReproduction) {
		this.posX = posX;
		this.posY = posY;
		this.speedX = speedX;
		this.speedY = speedY;
		this.routeMove = routeMove;
		this.type = type;
		this.health = health;
		this.cycleNotReproduction = cycleNotReproduction;
		this.colissionTrue = false;
	},
	createNewBacteria: function(posX, posY, speedX, speedY, type, health, routeMove) {	
	//// Координаты 
		if (posX === undefined) { // Координата X
			posX = nRand(this.clientMaxX-this.clientMinX-this.customSizeBacteria)+this.clientMinX+this.customSizeBacteria;
		}
		if (posY === undefined) { // Координата Y
			posY = nRand(this.clientMaxY-this.clientMinY-this.customSizeBacteria)+this.clientMinY+this.customSizeBacteria;
		}
	//// Скорости движения
		if (speedX === undefined) { // Скорость движения X
			speedX = nRand(100);
		}
		if (speedY === undefined) { // Скорость движения Y
			speedY = nRand(100);
		}
		speedX = nDouble(speedX,3);
		speedY = nDouble(speedY,3);
	
	//// Направление движения 0-4
		if (routeMove === undefined) { // Направление
			routeMove = nRand(4);
		}
		
	//// Тип бактерии 0-4(
		// 0: Умножающая скорость,
		// 1: Нейтральная(ничего не делает)
		// 2: Уменьшающая скорость,
		// 3: Увеличивающая здоровье,
		// 4: Пожирающая здоровье(На N единиц больше, чем при ударе)
		if (type === undefined) { // Тип бактерии
			type = nRand(5);
		}
		
	//// Здоровье 0-100 Если меньше 1 бактерия дохнет 
		if (health === undefined) { // Здоровье
			health = 10 + nRand(10);
		}
		
	//// Добавляем сгенерированную бактерию	
		this.bacteria.push(new this.baseBacteria(posX, posY, speedX, speedY, routeMove, type, health, this.customCycleNotReproduction));
	},
	renderBacteria: function() {
		let canvas = document.getElementById("App");
		let context = canvas.getContext("2d");
		let finalRad = (360 * Math.PI) / 180;
			
		context.fillStyle = "#000000";
		canvas.width = this.clientMaxY;
		canvas.height = this.clientMaxX;
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		for (let i=0;i<this.bacteria.length;i++) {
			let colorBacteria = "#00FFFF";
			if (this.bacteria[i].type === 1) {
				colorBacteria = "#00FF00";
			} else if (this.bacteria[i].type === 2) {
				colorBacteria = "#FFFF00";
			} else if (this.bacteria[i].type === 3) {
				colorBacteria = "#D2691E";
			} else if (this.bacteria[i].type === 4) {
				colorBacteria = "#FF0000";
			}
			
			context.beginPath();
			context.arc(this.bacteria[i].posY, this.bacteria[i].posX,this.customSizeBacteria/2,0,finalRad,true);
			
			context.fillStyle = colorBacteria;
			context.fill();
		}
		for (let i=0;i<model.bacteria.length;i++) {model.bacteria[i].colissionStatus = false;}
		
		for (let i=0;i<this.bacteria.length;i++) {
			this.moveBacteria(i);
		}
		for (let i=0;i<this.bacteria.length;i++) {
			this.collisionBacteria(i);
		}
	},
	moveBacteria: function(posBact) {
		let posX  = model.bacteria[posBact].posX;
		let posY  = model.bacteria[posBact].posY;
		let speedX = model.bacteria[posBact].speedX;
		let speedY = model.bacteria[posBact].speedY;
		let routeMove = model.bacteria[posBact].routeMove;
		
		let speedOthX = speedX/this.renderFrame;
		let speedOthY = speedY/this.renderFrame;
		if (speedOthX < 0) {speedOthX = 0;}
		if (speedOthY < 0) {speedOthY = 0;}
		
		if (--model.bacteria[posBact].cycleNotReproduction < 0) {model.bacteria[posBact].cycleNotReproduction = 0;};
		
		if (routeMove === 0) {
			posX -= speedOthX;
			posY -= speedOthY;
		} else if (routeMove === 1) {
			posX -= speedOthX;
			posY += speedOthY;
		} else if (routeMove === 2) {
			posX += speedOthX;
			posY -= speedOthY;
		} else if (routeMove === 3) {
			posX += speedOthX;
			posY += speedOthY;
		}
		
		posX = nDouble(posX,6);
		posY = nDouble(posY,6);
		
		if (posY < model.clientMinY+model.customSizeBacteria/2) { 
			if (routeMove === 0) {
				routeMove = 1;
			} else if (routeMove === 2) {
				routeMove = 3;
			}
		}
		
		if (posY > model.clientMaxY-model.customSizeBacteria/2) { 
			if (routeMove === 1) {
				routeMove = 0;
			} else if (routeMove === 3) {
				routeMove = 2;
			}
		}
		
		if (posX < model.clientMinX+model.customSizeBacteria/2) { 
			if (routeMove === 0) {
				routeMove = 2;
			} else if (routeMove === 1) {
				routeMove = 3;
			}
		}
		
		if (posX > model.clientMaxX-model.customSizeBacteria/2) { 
			if (routeMove === 2) {
				routeMove = 0;
			} else if (routeMove === 3) {
				routeMove = 1;
			}
		}
		
		model.bacteria[posBact].posX = posX;
		model.bacteria[posBact].posY = posY;
		model.bacteria[posBact].speedX = speedX;
		model.bacteria[posBact].speedY = speedY;
		model.bacteria[posBact].routeMove = routeMove;
		
	},
	collisionBacteria: function(posBact) {
		for (let i=0;i<this.bacteria.length;i++) {
			if (i != posBact) {
				let X = this.bacteria[posBact].posX - this.bacteria[i].posX;
				let Y = this.bacteria[posBact].posY - this.bacteria[i].posY;
				let collisionRadius	= Math.sqrt(X*X+Y*Y);
				if (collisionRadius<this.customSizeBacteria) { // Если бактерии столкнулись
					//// Генерируем новые направления движения бактерий 
					if (X <= 0 && Y <= 0) {
						this.bacteria[posBact].routeMove = 0;
						this.bacteria[i].routeMove = 3;
					} else if (X >= 0 && Y >= 0) {
						this.bacteria[posBact].routeMove = 3;
						this.bacteria[i].routeMove = 0;
					} else if (X <= 0 && Y >= 0) {
						this.bacteria[posBact].routeMove = 1;
						this.bacteria[i].routeMove = 2;
					} else if (X >= 0 && Y <= 0) {
						this.bacteria[posBact].routeMove = 2;
						this.bacteria[i].routeMove = 1;
					}  
				
					if (model.bacteria[i].cycleNotReproduction === 0 && model.bacteria[posBact].cycleNotReproduction === 0
						&& model.bacteria[i].colissionStatus === false && model.bacteria[posBact].colissionStatus === false
						) { // Порождаем новую бактерию
						let newHealth = Math.floor((model.bacteria[i].health+model.bacteria[posBact].health)/2+nRand(20));
						if (newHealth < 0) {newHealth = 1;}
						//// Вычисляем координаты появления и направление движения
						let newPosX = 0;
						let newPosY = 0;
						let newRouteMove = undefined;
						if (Math.floor(Math.random()*2) == 0) {
							newPosX = this.bacteria[posBact].posX;
						} else {
							newPosY = this.bacteria[posBact].posY;
						}
						
						let newSpeedX = (this.bacteria[posBact].speedX+this.bacteria[i].speedX)/2 - 50 + nRand(100);
						let newSpeedY = (this.bacteria[posBact].speedY+this.bacteria[i].speedY)/2 - 50 + nRand(100);
						if (newSpeedX < 1) {newSpeedX = 1;}
						if (newSpeedY < 1) {newSpeedY = 1;}

						//// Генерируем бактерию
						this.createNewBacteria(newPosX, newPosY, newSpeedX, newSpeedY, undefined, newHealth, newRouteMove);
						model.bacteria[i].cycleNotReproduction = this.customCycleNotReproduction;
						model.bacteria[posBact].cycleNotReproduction = this.customCycleNotReproduction;						
					}
					
					function doBacteria(dest,src) { // Взаимодействия между бактериями
						if (model.bacteria[dest].colissionStatus === false) {
							model.bacteria[dest].health--;
							model.bacteria[dest].colissionStatus = true;
							if (model.bacteria[dest].type === 0) {
								model.bacteria[src].speedX += (10 + nRand(10));
								model.bacteria[src].speedY += (10 + nRand(10));
							} else if (model.bacteria[dest].type === 2) {
								model.bacteria[src].speedX -= (10 + nRand(10));
								model.bacteria[src].speedY -= (10 + nRand(10));
								if (model.bacteria[src].speedX < 0) {model.bacteria[src].speedX = 0;}
								if (model.bacteria[src].speedY < 0) {model.bacteria[src].speedY = 0;}								
							} else if (model.bacteria[dest].type === 3) {
								model.bacteria[src].health += (1 + nRand(10));   
							} else if (model.bacteria[dest].type === 4) {
								model.bacteria[src].health -= (1 + nRand(10));
							}
						}	
					}
	
					doBacteria(i,posBact);
					doBacteria(posBact,i);
				}
			}
		}
	}
}


function nRand(value) {
	return Math.floor(Math.random()*value);
}

function nDouble(value,digit) {
	if (digit < 0) {digit = 0;}
	let variable = Math.pow(10,digit);
	return Math.floor(value * variable)/variable;
}

window.onload = 
	function(){
		for (let i=0; i<20; i++) {
			model.createNewBacteria();
		}
	
		setInterval(
			function () {
				for (let i=0;i<model.bacteria.length;i++) {
					if (model.bacteria[i].health < 1) {
						model.bacteria.splice(i,1);
					}
				}
				model.renderBacteria();
			}
		,1000/model.renderFrame);
	
		setInterval(
			function () {
				// 0: Умножающая скорость,
				// 1: Нейтральная(ничего не делает)
				// 2: Уменьшающая скорость,
				// 3: Увеличивающая здоровье,
				// 4: Пожирающая здоровье(На N единиц больше, чем при ударе)
				let neutral = 0;
				let speedInc = 0;
				let speedDec = 0;
				let healthInc = 0;
				let healthDec = 0;
				
				for (let i=0;i<model.bacteria.length;i++) {
					if (model.bacteria[i].type === 0) {speedInc++;}
					if (model.bacteria[i].type === 1) {neutral++;}
					if (model.bacteria[i].type === 2) {speedDec++;}
					if (model.bacteria[i].type === 3) {healthInc++;}
					if (model.bacteria[i].type === 4) {healthDec++;}
				}
				document.getElementById("countBacterial").innerHTML = "Bacterial count: "+model.bacteria.length +
					"; neutral: " + neutral + "; speedInc: " + speedInc + "; speedDec: " + speedDec + "; healthInc: " + healthInc +"; healthDec: " + healthDec;
				model.clientMaxX = document.documentElement.clientHeight-30; 
				model.clientMaxY = document.documentElement.clientWidth-10;
			}
		,1000);
	}

window.onmousedown = function killBactery(e) {
	let posMouseX = e.clientX;
	let posMouseY = e.clientY-20;
	
	for (let i=0;i<model.bacteria.length;i++) {
		let X = posMouseY - model.bacteria[i].posX;
		let Y = posMouseX - model.bacteria[i].posY;
		Hypotenusa = Math.sqrt(X * X + Y * Y);
		if (Hypotenusa < model.customSizeBacteria) {
			model.bacteria.splice(i,1);
		}
	}
}


