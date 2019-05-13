import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AddressesComponent } from '../../addresses/addresses.component';
import { SendComponent } from '../../send/send.component';
import { TransactionsComponent } from '../../transactions/transactions.component';
import { NamecoinComponent } from '../../namecoin/namecoin.component';
import { NamecoinlistComponent } from '../../namecoinlist/namecoinlist.component';
import { ChatComponent } from '../../chat/chat.component';
import { SettingsComponent } from '../../settings/settings.component';
import { ConsoleComponent } from '../../console/console.component';

export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard',      component: DashboardComponent },
    { path: 'addresses',      component: AddressesComponent },
    { path: 'send',     component: SendComponent },
    { path: 'transactions',     component: TransactionsComponent },
    { path: 'namecoin',          component: NamecoinComponent },
	{ path: 'namecoinlist',          component: NamecoinlistComponent },
	{ path: 'chat',          component: ChatComponent },
    { path: 'settings',           component: SettingsComponent },
    { path: 'console',  component: ConsoleComponent },
];
