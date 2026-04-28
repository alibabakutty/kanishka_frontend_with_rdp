import FetchItemPurchaseOrder from "../components/fetch/General/FetchItemPurchaseOrder";
import FetchPurchaseOrder from "../components/fetch/General/FetchPurchaseOrder";
import GatewayPage from "../components/gateway/GatewayPage";
import Home from "../components/Home";
import Login from "../components/login/LoginPage";
import CustomerMaster from "../components/master/CustomerMaster";
import InventoryMaster from "../components/master/InventoryMaster";
import PurchaseOrder from "../components/purchase_order/PurchaseOrder";
import Labour from "../components/fetch/Labour/LabourPurchaseOrder";
import MaterialPo from "../components/fetch/Material/MaterialPo";
import DayBook from "../components/fetch/Daybook/daybook";
import FetchDbItemwise from "../components/fetch/Daybook/daybook_item"
import FetchLabourItem from "../components/fetch/Labour/FetchLabourItem"
import FetchMaterialItem from "../components/fetch/Material/FetchMaterialItem";

const routeConfig = [
    { path: '/',                          element: <Home /> },
    { path: '/login',                     element: <Login /> },
    { path: '/gateway',                   element: <GatewayPage /> },
    { path: '/purchase_order',            element: <PurchaseOrder /> },
    { path: '/fetch_purchase_order',      element: <FetchPurchaseOrder /> },
    { path: '/fetch_material_po',         element: <MaterialPo /> },
    { path: '/fetch_material_item',         element: <FetchMaterialItem /> },
    { path:'/fetch_labour_po',            element:<Labour/>},
    { path:'/fetch_labour_item',          element:<FetchLabourItem/>},
    { path:'/daybook',                    element:<DayBook/>},
    { path:'/daybook_item',               element:<FetchDbItemwise/> },
    { path: '/fetch_item_purchase_order', element: <FetchItemPurchaseOrder /> },
    { path: '/update_purchase_order/:id', element: <PurchaseOrder /> },
    { path: '/customers',                 element: <CustomerMaster /> },
    { path: '/inventory',                 element: <InventoryMaster /> }
];

export default routeConfig;