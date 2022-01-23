trackersList = [
	{
	"name" : "Revenue",
	"mapping" : "revenue",
	"api"	: "income-statement",
	"bb": True
	},
	{
	"name" : "D/E Ratio",
	"mapping" : "debtEquityRatio",
	"api"	: "ratios",
	"bb": False
	},
	{
	"name" : "Turnover",
	"mapping" : "assetTurnover",
	"api" : "ratios",
	"bb" : True
	},
	{
	"name" : "EBIT Margin",
	"mapping" : "operatingProfitMargin",
	"api" : "ratios",
	"bb" : True
	},
	{
	"name" : "Net Profit Margin",
	"mapping" : "netProfitMargin",
	"api" : "ratios",
	"bb" : True
	},
	{
	"name" : "Quick Ratio",
	"mapping" : "quickRatio",
	"api" : "ratios",
	"bb" : True
	},
	{
	"name" : "Debt Ratio",
	"mapping" : "debtRatio",
	"api" : "ratios",
	"bb" : True
	},
	{
	"name" : "ROE",
	"mapping" : "returnOnEquity",
	"api" : "ratios",
	"bb" : True
	},
	{
	"name" : "EPS",
	"mapping" : "eps",
	"api" : "income-statement",
	"bb" : True
	},
	{
	"name" : "Net Profit",
	"mapping" : "netIncome",
	"api" : "income-statement",
	"bb" : True
	},
	# Cash flow from operating activities, used to meet financial obligations
	{
	"name" : "CFO",
	"mapping" : "operatingCashFlow",
	"api" : "cash-flow-statement",
	"bb" : True
	},
	# Free cash flow = CFO - cash for capital expenditures, basically left over cash
	{
	"name" : "FCF",
	"mapping" : "freeCashFlow",
	"api" : "cash-flow-statement",
	"bb" : True
	},
	{
	"name" : "EBITDA",
	"mapping" : "ebitda",
	"api" : "income-statement",
	"bb" : True
	},
	{
	"name" : "Assets",
	"mapping" : "totalAssets",
	"api" : "balance-sheet-statement",
	"bb" : True
	},
]