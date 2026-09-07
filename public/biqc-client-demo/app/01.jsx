import React, { useEffect, useMemo, useRef, useState } from 'https://esm.sh/react@19.1.1';
import { createRoot } from 'https://esm.sh/react-dom@19.1.1/client';
import {
  Activity, ArrowRight, Bot, Boxes, BrainCircuit, Building2, CalendarDays,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleDollarSign, Clock3,
  Cloud, Command, CreditCard, Database, FileClock, FileSearch, Filter, Gauge,
  Globe2, HardDrive, KeyRound, LayoutDashboard, Link2, LockKeyhole, Mail,
  Menu, MessageSquareText, MoreHorizontal, Network, Plug, RefreshCw, Search,
  Send, Settings, Shield, ShieldCheck, Sparkles, TerminalSquare, Users,
  UserX, Webhook, X, Zap, ZapOff, ExternalLink, Eye, EyeOff, AlertTriangle,
  CircleHelp, PanelLeftClose, PanelLeftOpen, Copy, CheckCheck, SlidersHorizontal,
  BarChart3, Workflow, Radio, ServerCog, BadgeCheck, TimerReset, Fingerprint
} from 'https://esm.sh/lucide-react@0.468.0?deps=react@19.1.1';

const navGroups = [
  { label: 'Workspace', items: [
    ['overview','Overview',LayoutDashboard], ['ask','Ask BIQc',MessageSquareText], ['pulse','Pulse',Activity]
  ]},
  { label: 'Governance', items: [
    ['connections','Connections',Plug], ['plugins','Plugins & actions',Boxes], ['team','Team & access',Users], ['rules','Roles & data rules',ShieldCheck], ['audit','Audit trail',FileClock]
  ]},
  { label: 'System', items: [
    ['sync','Sync health',RefreshCw], ['architecture','AI architecture',Network], ['settings','Workspace settings',Settings]
  ]},
];

const initialConnections = [
  {id:1, name:'HubSpot', category:'CRM', icon:'H', status:'Connected', health:'Healthy', sync:'2 min ago', scope:'Contacts, deals, activity', color:'#ff7a59'},
  {id:2, name:'Xero', category:'Accounting', icon:'X', status:'Connected', health:'Healthy', sync:'5 min ago', scope:'Invoices, contacts, reports', color:'#13b5ea'},
  {id:3, name:'Gmail', category:'Email', icon:'G', status:'Connected', health:'Healthy', sync:'1 min ago', scope:'Read, draft, send with confirmation', color:'#ea4335'},
  {id:4, name:'Google Calendar', category:'Calendar', icon:'31', status:'Connected', health:'Warning', sync:'18 min ago', scope:'Events, availability', color:'#4285f4'},
  {id:5, name:'Google Drive', category:'Files', icon:'D', status:'Connected', health:'Healthy', sync:'7 min ago', scope:'Selected drives & folders', color:'#34a853'},
  {id:6, name:'Zapier', category:'Automation', icon:'Z', status:'Available', health:'—', sync:'Never', scope:'Connect on demand', color:'#ff4f00'},
  {id:7, name:'MYOB', category:'Accounting', icon:'M', status:'Available', health:'—', sync:'Never', scope:'Connect on demand', color:'#a533ff'},
  {id:8, name:'ServiceM8', category:'Field service', icon:'S8', status:'Available', health:'—', sync:'Never', scope:'Jobs, clients, scheduling', color:'#0c8ed9'},
];

const initialUsers = [
  {id:1, name:'Sarah Chen', initials:'SC', email:'sarah@northstar.au', role:'Admin', status:'Active', last:'Now', prompts:124},
  {id:2, name:'James Walker', initials:'JW', email:'james@northstar.au', role:'Sales', status:'Active', last:'8 min', prompts:98},
  {id:3, name:'Priya Deshmukh', initials:'PD', email:'priya@northstar.au', role:'Finance', status:'Active', last:'32 min', prompts:87},
  {id:4, name:'Tom Nguyen', initials:'TN', email:'tom.contractor@northstar.au', role:'Contractor', status:'Active', last:'2 hr', prompts:21},
];

const auditRows = [
  {time:'10:18:32', user:'James Walker', action:'Tool action', resource:'HubSpot · Draft follow-up', result:'Confirmed', model:'Claude 4', latency:'1.8s'},
  {time:'10:16:04', user:'Sarah Chen', action:'Question', resource:'Xero · overdue invoices', result:'Allowed', model:'GPT-5', latency:'2.3s'},
  {time:'10:13:47', user:'Tom Nguyen', action:'Policy check', resource:'HR & salaries', result:'Blocked', model:'—', latency:'42ms'},
  {time:'10:09:11', user:'Priya Deshmukh', action:'Tool action', resource:'Gmail · draft supplier email', result:'Confirmed', model:'GPT-5', latency:'1.4s'},
  {time:'09:58:25', user:'James Walker', action:'Question', resource:'HubSpot · pipeline risk', result:'Allowed', model:'Claude 4', latency:'2.1s'},
  {time:'09:44:03', user:'Sarah Chen', action:'Connection', resource:'Google Calendar · reconnect', result:'Success', model:'—', latency:'860ms'},
  {time:'09:31:55', user:'Priya Deshmukh', action:'Question', resource:'Xero · cash runway', result:'Allowed', model:'GPT-5', latency:'2.7s'},
  {time:'09:20:12', user:'Tom Nguyen', action:'Tool action', resource:'Gmail · send message', result:'Blocked', model:'—', latency:'51ms'},
];

const roleDefaults = {
  Admin: {Financials:true, 'Client personal data':true, 'HR & salaries':true, 'Pipeline & deals':true, Email:true, Calendar:true},
  Sales: {Financials:false, 'Client personal data':true, 'HR & salaries':false, 'Pipeline & deals':true, Email:true, Calendar:true},
  Finance: {Financials:true, 'Client personal data':false, 'HR & salaries':true, 'Pipeline & deals':false, Email:true, Calendar:false},
  Contractor: {Financials:false, 'Client personal data':false, 'HR & salaries':false, 'Pipeline & deals':false, Email:false, Calendar:true},
};

function Logo(){
  return <div className="brand"><div className="brand-mark"><span>BI</span><i>Q</i><span>c</span></div><div className="brand-sub">GOVERNED AI</div></div>
}

function App(){
  const [page,setPage]=useState('overview');
  const [sidebar,setSidebar]=useState(true);
  const [connections,setConnections]=useState(initialConnections);
  const [users,setUsers]=useState(initialUsers);
  const [roles,setRoles]=useState(roleDefaults);
  const [toast,setToast]=useState(null);
  const [commandOpen,setCommandOpen]=useState(false);
  const [modal,setModal]=useState(null);
  const [usage,setUsage]=useState(64);

  const notify=(message,type='success')=>{setToast({message,type}); setTimeout(()=>setToast(null),2800)};
  const go=(id)=>{setPage(id); window.scrollTo({top:0,behavior:'smooth'})};

  useEffect(()=>{
    const handler=(e)=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault(); setCommandOpen(v=>!v)}
      if(e.key==='Escape'){setCommandOpen(false);setModal(null)}
    };
    window.addEventListener('keydown',handler); return()=>window.removeEventListener('keydown',handler)
  },[]);

  useEffect(()=>{const handler=(e)=>notify(`${e.detail} opened in demo`);document.addEventListener('biqc-demo-action',handler);return()=>document.removeEventListener('biqc-demo-action',handler)},[]);

  const ctx={go,connections,setConnections,users,setUsers,roles,setRoles,notify,setModal,usage,setUsage};

  return <div className="app-shell">
    <aside className={`sidebar ${sidebar?'':'collapsed'}`}>
      <div className="sidebar-top"><Logo/><button className="icon-btn ghost collapse" onClick={()=>setSidebar(v=>!v)}>{sidebar?<PanelLeftClose/>:<PanelLeftOpen/>}</button></div>
      <div className="workspace-switch" onClick={()=>notify('Workspace switcher opened in demo')}><div className="workspace-logo">N</div>{sidebar&&<><div><b>Northstar Ops</b><span>Business workspace</span></div><ChevronDown className="ml-auto"/></>}</div>
      <nav>{navGroups.map(group=><div className="nav-group" key={group.label}>{sidebar&&<div className="nav-label">{group.label}</div>}{group.items.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} className={`nav-item ${page===id?'active':''}`} title={label}><Icon/><span>{label}</span>{id==='sync'&&<i className="status-dot warning"/>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="security-mini"><ShieldCheck/>{sidebar&&<div><b>Governance active</b><span>All prompts policy-checked</span></div>}</div>{sidebar&&<div className="profile-mini"><div className="avatar">SC</div><div><b>Sarah Chen</b><span>Workspace admin</span></div><MoreHorizontal className="ml-auto"/></div>}</div>
    </aside>

    <main className={`main ${sidebar?'':'wide'}`}>
      <header className="topbar">
        <div className="crumb"><span>Northstar Ops</span><ChevronRight/><b>{pageTitle(page)}</b></div>
        <div className="top-actions">
          <button className="command" onClick={()=>setCommandOpen(true)}><Search/>Search or jump to…<kbd>⌘ K</kbd></button>
          <button className="icon-btn" onClick={()=>notify('Help centre opened in demo')}><CircleHelp/></button>
          <button className="icon-btn" onClick={()=>notify('No new governance alerts')}><BellIcon/></button>
          <button className="avatar small" onClick={()=>notify('Profile menu opened in demo')}>SC</button>
        </div>
      </header>
      <section className="page-wrap">
        {page==='overview'&&<Overview {...ctx}/>} {page==='ask'&&<Ask {...ctx}/>} {page==='pulse'&&<Pulse {...ctx}/>} {page==='connections'&&<Connections {...ctx}/>} {page==='plugins'&&<Plugins {...ctx}/>} {page==='team'&&<Team {...ctx}/>} {page==='rules'&&<Rules {...ctx}/>} {page==='audit'&&<Audit {...ctx}/>} {page==='sync'&&<SyncHealth {...ctx}/>} {page==='architecture'&&<Architecture {...ctx}/>} {page==='settings'&&<SettingsPage {...ctx}/>} 
      </section>
    </main>

    {commandOpen&&<CommandPalette go={(id)=>{go(id);setCommandOpen(false)}} close={()=>setCommandOpen(false)}/>} 
    {modal&&<Modal modal={modal} close={()=>setModal(null)} ctx={ctx}/>} 
    {toast&&<div className={`toast ${toast.type}`}><CheckCircle2/>{toast.message}</div>}
  </div>
}

function pageTitle(id){return ({overview:'Overview',ask:'Ask BIQc',pulse:'Pulse',connections:'Connections',plugins:'Plugins & actions',team:'Team & access',rules:'Roles & data rules',audit:'Audit trail',sync:'Sync health',architecture:'AI architecture',settings:'Workspace settings'})[id]}

function PageHead({eyebrow,title,desc,actions}){return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{actions&&<div className="head-actions">{actions}</div>}</div>}

function Overview({go,connections,users,setModal}){
  const active=connections.filter(c=>c.status==='Connected').length;
  return <>
    <PageHead eyebrow="Workspace overview" title="Good evening, Sarah." desc="One governed view of AI activity, connected systems and team access." actions={<><button className="btn secondary" onClick={()=>go('architecture')}><Network/>View architecture</button><button className="btn primary" onClick={()=>go('ask')}><Sparkles/>Ask BIQc</button></>}/>
    <div className="hero-grid">
      <div className="hero-card command-center">
        <div className="hero-kicker"><span className="live-dot"/> GOVERNANCE ENGINE · LIVE</div>
        <h2>Your AI workforce is operating <em>inside policy.</em></h2>
        <p>Every prompt, tool call and connected source passes identity, role and data-boundary checks before execution.</p>
        <div className="hero-actions"><button className="btn light" onClick={()=>go('audit')}><FileSearch/>Inspect audit trail</button><button className="text-btn light-t" onClick={()=>go('rules')}>Review data rules <ArrowRight/></button></div>
        <div className="mesh-art" aria-hidden="true"><div className="orb o1"/><div className="orb o2"/><div className="ring r1"/><div className="ring r2"/><Shield className="hero-shield"/></div>
      </div>
      <div className="risk-card panel">
        <div className="card-head"><div><span className="micro">AI RISK POSTURE</span><h3>Controlled</h3></div><div className="risk-score"><b>92</b><span>/100</span></div></div>
