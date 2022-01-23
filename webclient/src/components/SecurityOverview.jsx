import React, {useState, useEffect} from 'react';
import {Row, Container, Col, Button} from 'react-bootstrap';
import DataGrid from 'react-data-grid';
import moment from 'moment';
import '../index.css';
import '../App.css';
import { WEBSERVER_URL } from '../config';

function Header(props) {
	const {name, symbol, industry, shsOutstanding, mktCap, currentPrice, setSymbol} = props;
	const [newSymbol, setNewSymbol] = useState('');
	return (
		<>
			<Container fluid>
				<Row>
					<input value={newSymbol} onChange={(e) => {setNewSymbol(e.target.value)}}/>
					<Button onClick={() => {setSymbol(newSymbol)}}/>
				</Row>

			</Container>
			<Container fluid>
				<Row>
					<Col className={'border border-dark'}>{industry}</Col>
					<Col className={'border border-dark'}>{symbol}</Col>
					<Col className={'border border-dark'}>{name}</Col>
				</Row>
				<Row>
					<Col className={'border border-dark'}>Market Cap: {mktCap}</Col>
					<Col className={'border border-dark'}>{currentPrice}</Col>
					<Col className={'border border-dark'}>Shares Outstanding: {Math.ceil(shsOutstanding)}</Col>
				</Row>
			</Container>
		</>
	)
}

export default function SecurityOverview(props) {

	const [columns, setColumns] = useState([]);
	const [rows, setRows] = useState([]);
	const [name, setName] = useState('');
	const [symbol, setSymbol] = useState('AAPL');
	const [industry, setIndustry] = useState('');
	const [shsOutstanding, setShsOutstanding] = useState(0);
	const [mktCap, setMktCap] = useState(0);
	const [currentPrice, setCurrentPrice] = useState(0);

	function getTrackerData() {
		const getTrackersUrl = `${WEBSERVER_URL}/trackerVals?symbol=${symbol}`;
		fetch(getTrackersUrl)
			.then((response) => response.json())
			.then((jsonRes) => {
				const datesSet = new Set();
				const newRows = [];
				const trackersToYears = {}
				jsonRes.forEach((datum) => {
					const year = moment(datum.date).year();
					const trackerName = datum.name;
					if (trackersToYears[trackerName]) {
						trackersToYears[trackerName][year] = datum.value;
					} else {
						trackersToYears[trackerName] = {};
						trackersToYears[trackerName][year] = datum.value;
					}
					datesSet.add(year);
				})
				// TODO: need to gracefully handle missing years/missing trackers
				Object.keys(trackersToYears).forEach((tracker) => {
					const yearsToVals = trackersToYears[tracker];
					const row = {
						tracker
					};
					Object.keys(yearsToVals).forEach((year) => {
						row[year] = yearsToVals[year];
					})
					newRows.push(row);
				})
				const dates = Array.from(datesSet);
				const newColumns = [
					{
						key: 'tracker',
						name: 'Year'
					}
				];
				dates.forEach((year) => newColumns.push({
					key: year,
					name: year
				}));
				setColumns(newColumns);
				setRows(newRows);
			})
	}

	function getSecurityData() {
		const getSecurityUrl = `${WEBSERVER_URL}/security?symbol=${symbol}`;
		fetch(getSecurityUrl)
			.then(response => response.json())
			.then(security => {
				if (security) {
					setName(security.name);
					setIndustry(security.industryName);
					setSymbol(security.symbol);
					setCurrentPrice(security.price);
					setMktCap(security.mktCap);
					setShsOutstanding(security.shsOutstanding);
					console.dir(security);
				}

			})
			.catch((err) => {
				// TODO: need better error handling, should display modal
				console.dir(err, {depth: null});
			})
	}

	useEffect(() => {
		if (symbol) {
			getSecurityData();
			// TODO: if we need to get the data from fmp, we need the server to give us a 202 so we can
			//  	 check again after it's been populated
			getTrackerData();
		}
	}, [symbol])

	return (
		<>
			<Header
				name={name}
				industry={industry}
				symbol={symbol}
				mktCap={mktCap}
				currentPrice={currentPrice}
				shsOutstanding={shsOutstanding}
				setSymbol={setSymbol}
			/>
			<DataGrid columns={columns} rows={rows} className={'height-100'}/>
		</>
	)

}