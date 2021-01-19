// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import GeneralCommand from "../../general/GeneralCommand";
import MapUICommand from "./MapUICommand";



const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralListLogic extends cc.Component {


    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    @property(cc.Label)
    cntLab:cc.Label = null;

    private _cunGeneral:number[] = [];
    private _type:number = 0;
    private _position:number = 0;

    protected onEnable():void{
        cc.systemEvent.on("update_my_generals", this.initGeneralCfg, this);
        cc.systemEvent.on("general_convert", this.initGeneralCfg, this);
        cc.systemEvent.on("chosed_general", this.onClickClose, this);
    }


    protected onDisable():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected onClickConvert(): void {
        cc.systemEvent.emit("open_general_convert");
        this.node.active = false;
    }

    protected initGeneralCfg():void{

        var basic = MapUICommand.getInstance().proxy.getBasicGeneral();
        var cnt = GeneralCommand.getInstance().proxy.getMyActiveGeneralCnt();
        this.cntLab.string = "(" + cnt + "/" + basic.limit + ")";

        let list:any[] = GeneralCommand.getInstance().proxy.getUseGenerals();
        let listTemp = list.concat();


        listTemp.forEach(item => {
            item.type = this._type;
            item.position = this._position;
        })


        for(var i = 0; i < listTemp.length ;i++){
            if(this._cunGeneral.indexOf(listTemp[i].id) >= 0 ){
                listTemp.splice(i,1);
                i--;
            }
        }

        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(listTemp);
    }



    public setData(data:number[],type:number = 0,position:number = 0):void{
        this._cunGeneral = [];
        if(data && data.length > 0){
            this._cunGeneral = data;
        }
        
        this._type = type;
        this._position = position;

        this.initGeneralCfg();
        GeneralCommand.getInstance().qryMyGenerals();
    }

}
