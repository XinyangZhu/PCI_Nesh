import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Styled from 'styled-components';
import data from '../assets/data.json';

const Button = Styled.button`
	border-radius: 3px;
	padding: 0.25em 1em;
	background: ${props => props.primary ? '#f4e141' : 'transparent'};
	color: ${props => props.primary ? 'white' : '#f4e141'};
	border: 2px solid #f4e141;
	font-size: ${props => props.primary ? '1em' : '1.2em'};
`;

class Info extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		if (this.props.ticker) {
			const myData = data[this.props.ticker];
			const market_data = myData["market_data"];
			const transcript_data = myData["call_transcript"]

			const Grid = Styled.div`
				display: grid; 
				grid-template-columns: auto auto;
				grid-template-rows: auto auto auto auto auto;
				border-radius: 10px;
				border: 2px solid #f4e141;
				margin-top: 20px;
				margin-bottom: 20px;
			`;
			const Detail = Styled.div`
				grid-column: ${props => props.col};
				grid-row: ${props => props.row};
				text-align: center;
				font-size: ${props => props.primary ? '1.2em' : '1em'};
				padding: 8px;
				border-bottom: 2px solid #f4e141;
				border-right: ${props => props.col == 1 ? '2px solid #f4e141' : 'none'};
			`;

			const Name = Styled.h3`
				color: white;
				margin-top: 15px;
			`;

			return (
				<div>
					<h1 style={{marginTop: '15px'}} className="cover-heading">Company Insights for {this.props.ticker}</h1>
					<hr style={{height: '1px', borderTop: '1px solid #f4e141', display: 'block'}}/>
					<Name>
						Basic Information
					</Name>
					<Grid>
						<Detail primary row="1" col="1">
							Ticker
						</Detail>
						<Detail row="1" col="2">
							{myData["ticker"]}
						</Detail>
						<Detail primary row="2" col="1">
							Stock Price
						</Detail>
						<Detail row="2" col="2">
							{myData["stock_price"]}
						</Detail>
						<Detail primary row="3" col="1">
							Trend
						</Detail>
						<Detail row="3" col="2">
							{myData["trend"]}
						</Detail>
						<Detail primary row="4" col="1">
							Related Articles
						</Detail>
						<Detail row="4" col="2">
							<ul>
							{myData["articles"].map((article, i) => {
								return (<li style={{cursor: 'pointer'}} key={i} onClick={() => window.open(myData["hrefs"][i], '_blank')}><u>{article}</u></li>);
							})}
							</ul>
						</Detail>
					</Grid>
					<Name>
						Market Data
					</Name>
					<Grid>
						{Object.keys(market_data).map((key, i) => {
							let row = i + 5;
							return (<Detail key={row} row={row} col="1">{key}</Detail>);
						})}
						{Object.keys(market_data).map((key, i) => {
							let row = i + 5;
							return (<Detail key={row} row={row} col="2">{market_data[key]}</Detail>);
						})}
					</Grid>
					<Name>
						Analysis of Earnings Call Transcript
					</Name>
					{transcript_data["title"]
						? (<p>{transcript_data["title"]}</p>)
						: (<p></p>)}
					{transcript_data["title"]
						? (
							<Grid>
								<Detail row="1" col="1">
									Executives
								</Detail>
								<Detail row="1" col="2">
									<ul>
										{transcript_data["company_parts"].map((part) => {
											if (part == transcript_data["top_caller"]) {
												return (<li key={part}>{part}<i style={{color: 'black'}}> [Longest Speaker] </i></li>);
											} else if (part == transcript_data["nt_caller"]) {
												return (<li key={part}>{part}<i style={{color: 'black'}}> [Shortest Speaker] </i></li>);
											} else {
												return (<li key={part}>{part}</li>);
											}
											
										})}
									</ul>
								</Detail>
								<Detail row="2" col="1">
									Analysts
								</Detail>
								<Detail row="2" col="2">
									<ul>
										{transcript_data["call_parts"].map((part) => {
											if (part == transcript_data["top_caller"]) {
												return (<li key={part}>{part}<i style={{color: 'black'}}> [Longest Speaker] </i></li>);
											} else if (part == transcript_data["nt_caller"]) {
												return (<li key={part}>{part}<i style={{color: 'black'}}> [Shortest Speaker] </i></li>);
											} else {
												return (<li key={part}>{part}</li>);
											}
											
										})}
									</ul>
								</Detail>
							</Grid>
							)
						: (
							<p>Currently not available.</p>
							)}
					
				</div>
			);
		} else {
			return (<div></div>);
		}
		
	}
}

export default Info;