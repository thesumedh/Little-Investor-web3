(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('b441c372-5d2b-479f-8815-a8827f2cfb67');

let visitorId = localStorage.getItem('li_visitor_id');
if (!visitorId) {
  visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('li_visitor_id', visitorId);
}

pendo.initialize({
  visitor: {
    id: visitorId
  },
  account: {
    id: 'acc_little_investors'
  }
});
