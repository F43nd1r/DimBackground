LL.bindClass("android.app.AlertDialog");
LL.bindClass("android.content.DialogInterface");
LL.bindClass("android.widget.EditText");
LL.bindClass("android.widget.TextView");
LL.bindClass("android.widget.LinearLayout");
LL.bindClass("android.widget.CheckBox");
LL.bindClass("android.text.InputType");

var MY_PKG="com.faendir.lightning_launcher.dimbackground";
// install (or update) a script given its id in the package, and its clear name in the launcher data
function installScript(id,name){
	// load the script (if any) among the existing ones
	var script=LL.getScriptByName(name);

	var script_text=LL.loadRawResource(MY_PKG,id);

	if(script==null){
		// script not found: install it
		script=LL.createScript(name,script_text,0);
	}else{
		// the script already exists: update its text
		script.setText(script_text);
	}
	return script;
}

//function to display an alert like Dialog, but scrollable and with custom Title
function text(txt,title)
{
	var builder=new AlertDialog.Builder(LL.getContext());
	builder.setMessage(txt);
	builder.setCancelable(true);
	builder.setTitle(title);
	builder.setNeutralButton("Close",new DialogInterface.OnClickListener(){onClick:function(dialog,id){dialog.dismiss();}});
	builder.create().show();
}

var c=LL.getEvent().getContainer();
if(c.getType()!="Container"||c.getOpener()==null||c.getOpener().getType()!="Folder")text("This Script doesn't work outside of Folders.\nLoad it in a Folder!","Error");
else
{
c.getOpener().close();
var data=JSON.parse(LL.getEvent().getContainer().getTag("dim"))||new Object();
var script=installScript("dimbackground","DimBackground");
LL.runScript(script.getName(),null);
var root=new LinearLayout(LL.getContext());
root.setOrientation(LinearLayout.VERTICAL);
var speedHint=new TextView(LL.getContext());
speedHint.setText("Speed to fade in/out for this folder (lower is faster, 1 for instant):");
root.addView(speedHint);
var speedInput=new EditText(LL.getContext());
speedInput.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
speedInput.setInputType(InputType.TYPE_CLASS_NUMBER);
speedInput.setText(data.speed||"10");
root.addView(speedInput);
var dimHint=new TextView(LL.getContext());
dimHint.setText("How dark should it be (0..255):");
root.addView(dimHint);
var dimInput=new EditText(LL.getContext());
dimInput.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT));
dimInput.setInputType(InputType.TYPE_CLASS_NUMBER);
dimInput.setText(data.dim||"200");
root.addView(dimInput);
var barBox = new CheckBox(LL.getContext());
barBox.setText("Tint System Bars");
barBox.setChecked(data.bars||true);
root.addView(barBox);
var fixBox=new CheckBox(LL.getContext());
fixBox.setText("Orientationfix (Fixes bug when changing orientation while folder opened, but may break desktop boundings)");
fixBox.setChecked(data.fix||false);
root.addView(fixBox);
var closeBox=new CheckBox(LL.getContext());
closeBox.setText("Close all Folders if background is clicked");
closeBox.setChecked(data.close||false);
root.addView(closeBox);
var builder=new AlertDialog.Builder(LL.getContext());
builder.setView(root);
builder.setCancelable(true);
builder.setTitle("Setup: Folder Dim");
builder.setNegativeButton("Cancel",new DialogInterface.OnClickListener(){onClick:function(dialog,id){dialog.cancel();}});
builder.setPositiveButton("Confirm",new DialogInterface.OnClickListener()
{
    onClick:function(dialog,id)
    {
        var speed=speedInput.getText().toString();
        var dim=dimInput.getText().toString();
        if(speed<=0||dim<0||dim>255)
        {
            Android.makeNewToast("Error:\nOne or more arguments are out of range. Please make sure that speed is 1 or bigger and dim is between 0 and 255",false).show();
        }
        else
        {
            dialog.dismiss();
            item=c.getItemByLabel("bg");
            while(item!=null)
            {
                c.removeItem(item);
                item=c.getItemByLabel("bg");
            }
            var data=new Object();
            data.speed=speed;
            data.dim=dim;
            data.fix=fixBox.isChecked();
            data.bars=barBox.isChecked();
            data.close=closeBox.isChecked();
            c.setTag("dim",JSON.stringify(data));
            c.getProperties().edit().setEventHandler("resumed",EventHandler.RUN_SCRIPT,script.getId()).setEventHandler("paused",EventHandler.RUN_SCRIPT,script.getId()).commit();
            Android.makeNewToast("Done!",true).show();
            c.getOpener().open();
        }
    }
});
builder.create().show();
}