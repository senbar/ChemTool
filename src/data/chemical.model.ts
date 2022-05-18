import _ from 'lodash'
namespace Model {
    interface Chemical{
        Name:string;
        Recipe: {parts:number, substrate:Chemical}[]
    }

}