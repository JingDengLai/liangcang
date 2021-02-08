var sgmp_sms_api = "http://127.0.0.1:8010/sgmp-sms-api";
var sgmp_websocket = "http://127.0.0.1:8020/sgmp-websocket";
//定时任务
var task_manager_api = "http://10.1.4.145:5010/scheduler/api/task";
//static data download
//var modelpath = "http://10.1.4.148:88/static/sgmp/data/model/window/";
var modelpath = "http://10.1.4.148:88/static/sgmp/";
/**
 * 预警类型
 */
//粮温预警
var WARNING_TEMPERATURE ="1";
//湿度预警
var WARNING_HUMIDITY ="2";
//水分预警 粮食水分小麦预警
var WARNING_MOISTURE ="3";
//氧气浓度预警
var WARNING_OXYGEN ="4";
//二氧化碳浓度预警
var WARNING_CARBON_DIOXIDE ="5";
//磷化氢浓度预警
var WARNING_PHOSPHINE ="6";
//虫害预警
var WARNING_PESTS ="7";
//应收账款账龄分预警
var WARNING_AGING ="8";
//合同结算超额预警
var WARNING_EXCESS ="9";
//出入库结算逾期预警
var WARNING_OVERDUE ="10";
//已付款未按期入库预警
var WARNING_UN_SCHEDULE ="11";
//直仓确认超时预警
var WARNING_CONFIRM_TIMEOUT ="12";
//仓间检验预警
var WARNING_TEST ="13";
//粮食储存期预警  粮食储存期小麦预警
var WARNING_STORAGE_PERIOD ="14";
//空仓预警
var WARNING_SHORT_POSITIONS ="15";

//轮换逾架空期预警    
var WARNING_ROTATION_EMPTY ="16";
//粮食水分玉米预警
var WARNING_MOISTURE_CORN ="17";
//粮食水分稻谷预警
var WARNING_MOISTURE_PADDY ="18";
//粮食储存期玉米预警
var WARNING_STORAGE_CORN ="19";
//粮食储存期稻谷预警
var WARNING_STORAGE_PADDY ="20";


/**
 * 预警业务类型
 */
//预警业务类型
var WARNING_TYPE_1 = "1";//粮食温湿度预警
var WARNING_TYPE_2 = "2";//水分预警
var WARNING_TYPE_3 = "3";//气体浓度预警
var WARNING_TYPE_4 = "4";//虫害预警
var WARNING_TYPE_5 = "5";//应收账款账龄预警
var WARNING_TYPE_6 = "6";//合同结算超额预警
var WARNING_TYPE_7 = "7";//出入库结算逾期预警
var WARNING_TYPE_8 = "8";//已付款未按期入库预警
var WARNING_TYPE_9 = "9";//日常事务预警
var WARNING_TYPE_10 = "10";//化验员日常质检预警
var WARNING_TYPE_11 = "11";//单仓单项能耗预警
var WARNING_TYPE_12 = "12";//粮食各项预警
