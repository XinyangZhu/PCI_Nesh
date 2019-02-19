import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Styled from 'styled-components';
import allCompanies from '../assets/companies.json';
import logos from '../assets/logos.json';


const Button = Styled.button`
	border-radius: 3px;
	padding: 0.25em 1em;
	background: ${props => props.primary ? '#f4e141' : 'transparent'};
	color: ${props => props.primary ? 'white' : '#f4e141'};
	border: 2px solid #f4e141;
	font-size: ${props => props.primary ? '1em' : '1.2em'};
	margin-bottom: 5px;
	cursor: pointer;
`;

const Input = Styled.input`
	color: black;
	font-size: 1.2em;
	border: 2px solid white;
	background-color: white;
	border-radius: 3px;
	padding: 0.25em 0.5em;
	margin: 0.5em;
`;

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {input: ""};
		this.changeInput = this.changeInput.bind(this);
		this.showCompany = this.showCompany.bind(this);
	}

	changeInput(event) {
		if (event.target.value == "") {
			this.setState({input: ""});
		}
	}

	showCompany(event) {
		this.setState({input: document.getElementById('search_box').value});
	}

	render() {

		return (
			<div>
    			<div className="lead">Enter company ticker below. </div>
    			<Input id='search_box' placeholder='Company Name' onChange = {this.changeInput}/>
				<br/>
				<Button onClick = {this.showCompany}>Search</Button>
				<br/>
				<Search_result id='search_result_container' query={this.state.input} setTicker={this.props.setTicker}/>
			</div>
		);
	}
}

class Search_result extends Component {
	constructor(props) {
		super(props);
		this.state = {allComps: allCompanies};
		// this.updatePossibleResults = this.updatePossibleResults.bind(this);
		// this.showDetail = this.showDetail.bind(this);
	}

	// componentDidUpdate(prevProps) {
		
	// 	if (this.props.query !== prevProps && this.props.query) {
	// 		console.log(1);
	// 		var currentComps = [];
	// 		for (var i = this.state.allComps.length - 1; i >= 0; i--) {
	// 			if (this.state.allComps[i].includes(this.props.query)) {
	// 				console.log(currentComps);
	// 				currentComps.push(this.state.allComps[i]);
	// 			}
	// 		}
	// 		this.setState({companies: currentComps.push(this.state.allComps[i])});
	// 	}
		
	// }

	// componentDidUpdate(prevProps) {
	// 	if (this.props.query !== prevProps.query) {
	// 		console.log(this.props.query);
	// 		this.state.query = this.props.query;
	// 		this.forceUpdate();
	// 	}
	// }

	render() {

		var currentComps = [];
		if (this.props.query) {
			for (var i = this.state.allComps.length - 1; i >= 0; i--) {
				if (this.state.allComps[i].includes(this.props.query)) {
					currentComps.push(this.state.allComps[i]);
				}
			}
		}
		
		return (
			<div>
    			{currentComps.map(company => {
    				return (<CompanyChoice key={company} company={company} style={{marginTop: "20px"}} setTicker={this.props.setTicker}></CompanyChoice>);
    			})}

    			
			</div>
		);
	}
}

class CompanyChoice extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		const Grid = Styled.div`
			display: grid; 
			grid-gap: 10px;
			grid-template-columns: auto auto;
			grid-template-rows: 100%;
			margin-top: 10px;
			margin-bottom: 10px;
			border-radius: 10px;
			border: 2px solid #f4e141;
		`;
		const Detail = Styled.div`
			grid-column: ${props => props.col};
			grid-row: ${props => props.row};
			text-align: center;
			font-size: 1.5em;
			padding: 5px;
		`;

		const Name = Styled.h3`
			color: white;
			margin-top: 10px;
		`;

		const Description = Styled.h6`
			text-align: center;
		`;

		const Logo = Styled.img`
			max-width: 200px; 
			max-height: 200px;
		`;

		return (
			<div>
				<Grid>
					<Detail row="1" col="1">
						<Logo src={logos[this.props.company]}/>
					</Detail>
					<Detail row="1" col="2">
						<Name>
							{this.props.company}
						</Name>
						<br/>
						<Description onClick = {() => this.props.setTicker(this.props.company)}>
							<u style={{cursor: 'pointer'}}>Read more about the company</u>
						</Description>
					</Detail>
				</Grid>
			</div>
		);
	}
}






export default Search;