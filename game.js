$(document).ready(function()
{
	//Canvas things
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var cWidth = canvas.width;
	var cHeight = canvas.height;
	var gameLoop; //to start & stop the game
	var menuLoop;
	var endLoop;
	
	//Mouse movement
	var mouseX,mouseY;
	canvas.onmousemove = function(e)
	{
		if (e.offsetX)
		{
			mouseX = e.offsetX;
		}
		else if (e.layerX)
		{
			mouseX = e.layerX;
		}
		if (e.offsetY)
		{
			mouseY = e.offsetY;
		}
		else if (e.layerY)
		{
			mouseY = e.layerY;
		}		
	};
	
	//IMG vars
	var bImg = new Image();
	var bLoaded = false;
	bImg.onload = function()
	{
		bLoaded = true;
	};
	bImg.src = "bg.png";
	var scImg = new Image();
	var scLoaded = false;
	scImg.onload = function()
	{
		scLoaded = true;
	};
	scImg.src = "score.png";	
	var sImg = new Image();
	var sLoaded = false;
	sImg.onload = function()
	{
		sLoaded = true;
	};
	sImg.src = "snowflake.png";
	var iImg = new Image();
	var iLoaded = false;
	iImg.onload = function()
	{
		iLoaded = true;
	};
	iImg.src = "icycle.png";
	var i2Img = new Image();
	var i2Loaded = false;
	i2Img.onload = function()
	{
		i2Loaded = true;
	};
	i2Img.src = "icycle2.png";
	var gImg = new Image();
	var gLoaded = false;
	gImg.onload = function()
	{
		gLoaded = true;
	};
	gImg.src = "gameOver.png";
	var mImg = new Image();
	var mLoaded = false;
	mImg.onload = function()
	{
		mLoaded = true;
	};
	mImg.src = "menu.png";
	var pImg = new Image();
	pImg.onload = function()
	{
		if (sLoaded && scLoaded && bLoaded && iLoaded && i2Loaded
			&& gLoaded && mLoaded)
		{
			initialize();
			menu();
		}	
	};
	pImg.src = "player.png";
	
	//Objects
	var player = new Player();
	var flakes = new Array();
	var icicles = new Array();
	for (var i = 0; i < 7; i++)
	{
		flakes.push(new Snowflake(randX(), randSpeed(0)));
		icicles.push(new Icicle(randX(), randSpeed(1)));
	}
	function Player()
	{
		this.width = 30;
		this.height = 60;
		this.x = cWidth / 2;
		this.y = canvas.height - 70;
		this.img = pImg;
	}
	function Snowflake(x,speed)
	{
		this.width = 30;
		this.height = 30;
		this.x = x;
		this.y = 0;
		this.speed = speed;
		this.img = sImg;
	}
	function Icicle(x,speed)
	{
		this.width = 20;
		this.height = 50;
		this.x = x;
		this.y = 0;
		this.speed = speed;
		this.img = iImg;
	}	
	
	//Extra vars
	var deaths, digits, deathImg,xPos,yPos,menuY,score,gameStarted,gameOver;
	
	//Game functions
	function initialize()
	{
		ctx.clearRect(0,0,cWidth,cHeight);
		xPos = 20;
		yPos = cHeight;
		menuY = 0;
		gameStarted = false;
		gameOver = false;
		deaths = 0;
		digits = 1;
		score = 0;
		deathImg = new Array();
		for (var i = 0; i < 3; i++)
		{
			deathImg.push(iImg);
		}		
	}
	
	canvas.addEventListener("click",buttonClick,false);
	function buttonClick(e)
	{
		if (!gameOver)
		{
			if (mouseX >= 255 && mouseX <= 475 &&
				mouseY >= 260 && mouseY <= 350)
			{
				gameStarted = true;
				setTimeout(function()
				{			
					clearInterval(menuLoop);
					canvas.style.cursor = "none";				
					startGame();
				},1000);
			}
		}
		else
		{
			if (mouseX >= 245 && mouseX <= 420 &&
				mouseY >= 452 && mouseY <= 470)
			{	
				clearInterval(endLoop);
				initialize();
				menu();
			}
		}
	}
	function menu()
	{
		ctx.drawImage(mImg, 0,0,cWidth,cHeight);
		menuLoop = setInterval(function()
		{
			if (mouseX >= 255 && mouseX <= 475 &&
				mouseY >= 260 && mouseY <= 350)
			{
				canvas.style.cursor = "pointer";
			}	
			else
			{
				canvas.style.cursor = "default";
			}
			if (gameStarted)
			{
				if (yPos <= cHeight)
				{
					ctx.clearRect(0,0,cWidth,cHeight);
					ctx.drawImage(mImg, 0, menuY, cWidth,cHeight);	
					menuY+= 20;
				}				
			}
		}, 1000/30);
	}
	function startGame()
	{
		gameLoop = setInterval(function()
		{
			update();
			draw();
		}, 1000/120);
	}
	function update()
	{
		if (mouseX < cWidth - player.width/2)
		{
			player.x = mouseX - (player.width /2); //changes the x position of the player
		}
		else
		{
			player.x = cWidth - (player.width /2); // makes it so the player doesnt go outside the canvas
		}
		for (var i = 0; i < flakes.length; i++)
		{
			fall(flakes[i], 0);
			fall(icicles[i], 1);
		}
	}
	function draw()
	{
		digits = parseFloat(score.toString().length); 
		if(deaths <= 2)
		{
			ctx.clearRect(0,0, cWidth, cHeight);
			ctx.drawImage(bImg, 0,0,cWidth,cHeight);
			ctx.drawImage(player.img, player.x,player.y,player.width,player.height);
			for (var i = 0; i < flakes.length; i++)
			{
				ctx.drawImage(flakes[i].img, flakes[i].x, flakes[i].y, flakes[i].width, flakes[i].height);
				ctx.drawImage(icicles[i].img, icicles[i].x, icicles[i].y, icicles[i].width, icicles[i].height);
			}		
			ctx.drawImage(scImg, 0,0, cWidth, 350);
			for (var i = 0; i < 3; i++)
			{
				ctx.drawImage(deathImg[i], xPos, 15, 20, 50);
				xPos += 35;
			}
			xPos = 20; 
			ctx.drawImage(sImg, cWidth - 50, 15, 30,30);
			ctx.font = "30px Arial Bold";
			ctx.fillStyle = "white";
			ctx.fillText(score, cWidth - 50 - (30 * digits), 40);
		}
		else
		{
			gameOver = true;
			if (yPos >= 0)
			{
				ctx.drawImage(gImg, 0, yPos, cWidth,cHeight);	
				yPos-= 10;
			}
			else
			{
				clearInterval(gameLoop);
				endLoop = setInterval(function()
				{
					ctx.font = "100px Arial Bold";
					ctx.strokeStyle = "black";
					ctx.lineWidth = "8";
					ctx.strokeText(score, cWidth / 2 - (30 * digits), cHeight - 195);					
					ctx.fillStyle = "white";
					ctx.fillText(score, cWidth / 2 - (30 * digits), cHeight - 195);
					

					if (mouseX >= 245 && mouseX <= 420 &&
						mouseY >= 452 && mouseY <= 470)
					{
						canvas.style.cursor = "pointer";
					}	
					else
					{
						canvas.style.cursor = "default";
					}
				}, 1000/30);				
			}
		}
	}
	function fall (obj, num)
	{
		if (obj.y < cHeight)
		{
			if ( (obj.y + obj.height >= player.y) &&
				 (obj.x + obj.width >= player.x && obj.x < player.x + player.width))
			{
				obj.y = 0;
				obj.x = randX();
				obj.speed = randSpeed(num);
				if (num == 0)
				{
					score++;
				}
				else
				{
					deathImg[deaths] = i2Img;
					if (deaths <= 2)
					{
						deaths++;
					}
				}
			}
			obj.y += obj.speed;
		}
		else
		{
			obj.y = 0;
			obj.x = randX();
			obj.speed = randSpeed(num);
		}
	}
	function randX()
	{
		return ((Math.random() * (cWidth - 30)) + 0);
	}
	function randSpeed(num)
	{		
		if (num == 0)
		{
			return ((Math.random() * 2) + 0.7);
		}
		else
		{
			return ((Math.random() * 6) + 3);
		}
	}
});