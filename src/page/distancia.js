import React from 'react';
import { Page, Panel, Table, TableHead, TableBody, TableRow, Pagination, Breadcrumbs } from 'react-blur-admin';
import { Row, Col } from 'react-flex-proto';
import './estilo.css';


export class Distancia extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }


  onSetCurrentPage(value) {
    this.setState({currentPage: value});
  }


  render() {
    return (
      <Page  title='Dados do sensor de proximidade'>
        <Panel>
          <Table>
            <TableHead>
              <th>Sensor</th>
              <th>Distância</th>
            </TableHead>
            <TableBody>
              <TableRow>
                <td><img src="http://www.fdlgroup.gr/wp-content/uploads/2018/01/load-sensor-brilliantile.png" style={{width: 50, height: 50}} /></td>
                <td>Ativado última vez em: 09/09/2019 com 20m</td>
              </TableRow>
              
            </TableBody>
          </Table>
          <Row>
          </Row>
        </Panel>

      </Page>  
    );
  }
}

