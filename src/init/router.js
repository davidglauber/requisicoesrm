import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import AppLayout from 'src/layout/app';
import Login from 'src/page/login';

/* Demos */
import { Welcome } from 'src/page/welcome';
import  Cadastrar  from 'src/page/cadastrar';
import { Chuva } from '../page/chuva/chuva';
import { cadLamp } from 'src/page/cadLamp';
import { Local } from '../page/local/local';
import { ListaLamp } from '../page/lampada/lampadas';
import { Distancia } from 'src/page/distancia';
import { About } from 'src/page/about';
import { editarSensorChuva } from '../page/chuva/editarSensorChuva';
import { editarLampada } from '../page/lampada/editarLampada';
import { ProgressBars } from 'src/page/progress-bars';
import { TableDemo } from 'src/page/table-demo';
import { ButtonDemo } from 'src/page/button-demo';
import { ModalDemo } from 'src/page/modal-demo';
import { TabsDemo } from 'src/page/tabs-demo';
import { InputDemo } from 'src/page/input-demo';
import { NotificationsDemo } from 'src/page/notifications-demo';
/* End Demos */

import { NotFound } from 'src/page/not-found';

// Redirect is got GH pages and can be deleted for forked projects
const redirect = <Redirect from="/react-webpack-skeleton" to="/" />;

export const AppRouter = (
  <Router history={browserHistory}>
    {redirect}
    <Route path='/login' component={Login} />
    <Route path='/cadastrar' component={Cadastrar} />
    <Route component={AppLayout}>
      <Route path='/' component={Welcome} />
      <Route path='/about' component={About}/>
      <Route path='/progress-bars' component={ProgressBars} />
      <Route path='/button-demo' component={ButtonDemo} />
      <Route path='/modal-demo' component={ModalDemo} />
      <Route path='/chuva' component={Chuva} />
      <Route path='/editarLampada/:location/:id' component={editarLampada}/>
      <Route path='/editarSensorChuva/:nome/:id' component={editarSensorChuva}/>
      <Route path='/cadastrarlampada' component={cadLamp} />
      <Route path='/listalamp' component={ListaLamp} />
      <Route path='/proximidade' component={Distancia} />
      <Route path='/table-demo' component={TableDemo} />
      <Route path='/tabs-demo' component={TabsDemo} />
      <Route path='/input-demo' component={InputDemo} />
      <Route path='/local' component={Local} />
      <Route path='/notifications-demo' component={NotificationsDemo} />
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);
