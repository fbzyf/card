/**
 * 公司预设数据配置文件
 * =====================
 * 【管理员使用说明】
 * 如果要添加新的公司，请按照下面的格式添加一个新的对象到 COMPANIES 数组中。
 * 
 * 字段说明：
 *   id          - 唯一标识符（英文，不能重复）
 *   nameCN      - 公司中文名称
 *   nameEN      - 公司英文名称
 *   logo        - 公司Logo图片路径（放在 assets/logos/ 文件夹下）
 *   addressCN   - 公司中文地址
 *   addressEN   - 公司英文地址
 *   website     - 公司网址（可选，留空则名片上不显示）
 *   phone       - 公司总机（可选）
 *   primaryColor - 公司主题色（十六进制颜色值）
 * 
 * 添加Logo步骤：
 *   1. 将Logo图片（建议PNG格式，透明背景）放到 assets/logos/ 文件夹
 *   2. 在下面 logo 字段填写文件名，如 "assets/logos/my-company.png"
 */

const COMPANIES = [
  {
    id: "lujingfeng",
    nameCN: "上海陆精丰电子有限公司",
    nameEN: "Shanghai Lujingfeng Electronic Technology Co., Ltd.",
    logo: "assets/logos/lujingfeng.svg",
    addressCN: "上海市徐汇区华泾路505号",
    addressEN: "505 Huajing Road, Xuhui District, Shanghai",
    website: "www.lpfbao.com",
    phone: "",
    primaryColor: "#1a73e8"
  },
  {
    id: "socam",
    nameCN: "SOCAM INTERNATIONAL LIMITED",
    nameEN: "SOCAM INTERNATIONAL LIMITED",
    logo: "assets/logos/socam.svg",
    addressCN: "RM06,13A/F SOUTH TOWER WORLD FINANCE CTR HARBOUR CITY 17 CANTON RD TST KLN HONG KONG",
    addressEN: "RM06,13A/F SOUTH TOWER WORLD FINANCE CTR HARBOUR CITY 17 CANTON RD TST KLN HONG KONG",
    website: "www.socam.site",
    phone: "",
    primaryColor: "#2d3748"
  },
  {
    id: "dbh",
    nameCN: "上海星展瀚电子信息科技有限公司",
    nameEN: "Shanghai DBH Electronic Information Technology Co., Ltd",
    logo: "assets/logos/dbh.svg",
    addressCN: "上海市徐汇区虹梅南路2007号1幢1层105室",
    addressEN: "Room 105, 1st Floor, Building 1, No. 2007 Hongmei South Road, Xuhui District, Shanghai",
    website: "www.sstarvast.com",
    phone: "",
    primaryColor: "#0077b6"
  },
  {
    id: "shunyu",
    nameCN: "上海舜宇恒平科学仪器有限公司",
    nameEN: "Shanghai Shunyu Hengping Scientific Instrument Co., Ltd.",
    logo: "assets/logos/shunyu.svg",
    addressCN: "上海市闵行区合川路3051号9幢102室",
    addressEN: "Room 102, Building 9, No. 3051 Hechuan Road, Minhang District, Shanghai",
    website: "www.hengpingyt.com",
    phone: "",
    primaryColor: "#2d6a4f"
  },
  {
    id: "hokuriku",
    nameCN: "北陆电子香港有限公司",
    nameEN: "Hokuriku Hong Kong Ltd",
    logo: "assets/logos/hokuriku.svg",
    addressCN: "香港九龙湾常悦道19号福康工业大厦9楼905室",
    addressEN: "FLAT/RM 905 9/F FOOK HONG INDUSTRIAL BUILDING 19 SHEUNG YUET ROAD KOWLOON BAY",
    website: "www.hokuriku-hk.com",
    phone: "",
    primaryColor: "#c53030"
  },
  {
    id: "jinglu",
    nameCN: "上海精陆电子科技有限公司",
    nameEN: "Shanghai Jinglu Electronics Technology Co., Ltd.",
    logo: "assets/logos/jinglu.svg",
    addressCN: "上海市徐汇区虹漕路25-1号2楼",
    addressEN: "2nd Floor, No. 25-1 Hongcao Road, Xuhui District, Shanghai",
    website: "www.hokuriku-cn.com",
    phone: "",
    primaryColor: "#4f46e5"
  }
];
