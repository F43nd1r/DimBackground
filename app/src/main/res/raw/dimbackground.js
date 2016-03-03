var data=JSON.parse(LL.getEvent().getContainer().getTag("dim"))||new Object();
var speed=data.speed||10;//lower is faster, 1 for instant
var dim=data.dim||150;//0 for nothing, 255 for solid black
var orientationfix=data.fix||false;//true if you want to switch screen orientation while folder open
var tintBars=data.bars||false;
var closeOnClick=data.close||false;
 
 
var d=LL.getCurrentDesktop();
var dp=d.getProperties();
var i=d.getItemByLabel("bg")||d.addShortcut("bg",new Intent(),0,0);
var p=i.getProperties();
if(LL.getEvent().getSource()=="C_RESUMED"&&LL.getOpenFolders().length==0)
{
d.setItemZIndex(i.getId(),d.getItems().getLength()-1);
var editor=p.edit();
editor.setBoolean("i.onGrid",false);
editor.setString("i.pinMode","XY");
editor.setBoolean("i.enabled",closeOnClick);
editor.setEventHandler("i.tap",EventHandler.CLOSE_ALL_FOLDERS,null);
editor.setString("i.selectionEffect","PLAIN");
editor.getBox("i.box").setColor("c","nsf",0x42FfFfFf);
editor.setBoolean("s.iconVisibility",false);
editor.setBoolean("s.labelVisibility",false);
editor.getBox("i.box").setColor("c","n",0xff000000);
editor.commit();
if(orientationfix){
var s=Math.max( d.getWidth(),d.getHeight())*1.1;
i.setSize(s,s);
}
else i.setSize( d.getWidth(),d.getHeight());
i.setPosition(0,0);
var x=0;
a();
}
else if(LL.getOpenFolders().length==0){
var x=speed;
b();
}
 
 
function a()
{
x++;
p.edit().setInteger("i.alpha",x*dim/speed).commit();
if(tintBars)dp.edit().setInteger("statusBarColor",Color.argb(x*dim/speed,0,0,0)).setInteger("navigationBarColor",Color.argb(x*dim/speed,0,0,0)).commit();
if(x<speed)setTimeout(a,0);
}
 
 
function b()
{
x--;
p.edit().setInteger("i.alpha",x*dim/speed).commit();
if(tintBars)dp.edit().setInteger("statusBarColor",Color.argb(x*dim/speed,0,0,0)).setInteger("navigationBarColor",Color.argb(x*dim/speed,0,0,0)).commit();
if(x>0)setTimeout(b,0);
else d.removeItem(i);
}