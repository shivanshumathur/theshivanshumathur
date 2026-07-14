(function () {
  const FORGE_IA = {"n": "Forge", "c": [{"n": "About Forge", "c": ["Why Forge", "Examples", "Marketplace", "Tutorials", "Roadmap", "Getting Started"]}, {"n": "Get started", "c": ["Getting started", {"n": "Introduction to Forge", "c": ["The Forge platform", "Why build with Forge", "Forge platform pricing", "Optimise Forge platform costs", "Cost estimator"]}, {"n": "AI development toolkit", "c": ["Overview", "Forge AI Plugin", "Forge MCP Server", "Forge skills"]}, {"n": "Migration guides", "c": ["Migrating your Connect app", "Migrating a Connect macro to Forge", "Upgrading to latest UI Kit version", "Migrating to Forge SQL", "Migrating from legacy KVS module", "Upgrading from legacy runtime", "Migrating a Forge app to support multiple Atlassian apps"]}, {"n": "Learn", "c": ["Building automations", "Building integrations", {"n": "Example apps", "c": ["Bitbucket", "Compass", "Confluence", "Jira", "Jira Service Management", "Rovo"]}, {"n": "Tutorials", "c": ["Overview", "Build an app compatible with Confluence and Jira", "Forge, Compass, and AWS CloudWatch", "Build a Jira automation action", "Schedule web triggers", "Debug functions using IntelliJ", "Debug functions using VS Code", "Profile app performance with tunnel debugger", "Implement a dynamic profile retriever", "Set up continuous delivery", "Queue app interactions with Storage API", "Use a long-running function", "Use custom entities to store structured data", "Use an external OAuth 2.0 API with fetch", "Add routing to a full-page app in Jira", "Use the storage API in Confluence", "Add custom configuration to a macro", "Using rich body macros", "Create an LLM Web trigger application", "Create an Agentic LLM Web trigger application", "Handling long-running LLM processes with Forge Realtime", {"n": "Bitbucket", "c": ["Extend Bitbucket Cloud", "Build a hello world app in Bitbucket", "Automate Bitbucket with triggers", "Build a pull request title validator with custom merge checks", "Orchestrate your builds using Dynamic Pipelines"]}, {"n": "Confluence", "c": ["Build a hello world app in Confluence", "Create a question generator app in multiple languages using i18n", "Create a quiz app using UI Kit", "Add configuration to a macro with UI Kit", "Create a logo designer app using the Frame component", "Use space settings and content byline to implement space news", "Use content actions to count page macros", "Build a Custom UI app", "Build a dashboard app with the Confluence full page module", "Build a Confluence keyword extractor with OpenAI", "Use highlighted text in a Confluence app", "Create a GIPHY app using UI kit on Confluence"]}, {"n": "External integrations", "c": ["Build a feedback app with integrations"]}, {"n": "Jira", "c": ["Build a hello world app in Jira", "Automate Jira with triggers", "Build a Jira comments summarizer app with OpenAI", "Use a workflow validator to check issue assignments", "Build a Custom UI app", "Build a dashboard app with the Jira full page module", "Build a Jira UI modifications app", "Build a Jira app with the Forge module command", "How to use Custom UI with the Forge module command"]}, {"n": "Jira Service Management", "c": ["Build a hello world app in Jira Service Management", "Import third party data into Assets", "Use Async Events API to queue jobs to import objects into Assets", "Build a Custom UI app"]}, {"n": "Customer Service Management", "c": ["Import customer context data with a Forge app"]}, {"n": "Rovo", "c": ["Extend Atlassian apps with a Forge Rovo agent", "Build a Rovo Agent app", "Build a Q&A Rovo Agent for Confluence", "Build a Jira issue analyst Rovo Agent", "Integrate remote agents with Jira"]}, {"n": "Teamwork Graph", "c": ["Call the Teamwork Graph API", "Build a Teamwork Graph connector", "Build an app with Teamwork Graph Smart Links"]}]}, "Atlassian developer glossary"]}]}, {"n": "Plan & design", "c": [{"n": "App architecture", "c": ["Events and triggers", "Storage", "Hosted storage data lifecycle", "Manifest", "App compatibility", "Modules", "App security"]}, {"n": "Build apps with the global:ui module (EAP)", "c": ["Overview", "Getting started", "global:ui module", "global:ui UI Kit components"]}, {"n": "Platform limits and usage", "c": ["Overview", "Exceeding limits and suspended apps", "Invocation limits", "Resource limits", "KVS and Custom Entity Store limits", "Forge SQL limits", "Forge Object Store (Preview)", "Forge LLM limits", "Forge Containers REST API limits", "Web trigger limits", "Async events limits", "App and developer limits", "Scheduled trigger limits", "Realtime limits"]}, {"n": "User interface", "c": ["Overview", "Build with UI Kit", "Extend UI with custom options", "Design tokens and theming", "Guidelines for action components", "Jira full-page modules", "Internationalization", "Understanding the UI modifications module"]}, {"n": "Legal & privacy", "c": ["Forge terms of use", "Forge service level agreement", "Shared responsibility model", "Analytics tool policy for Forge apps", "Forge privacy and security FAQ", "User privacy guide", "Forge Data Processing Addendum", "Logging data"]}, {"n": "App distribution", "c": ["Promote an app from staging to production", "Distribute via console", {"n": "Licensing", "c": ["Overview", "Adopt user-based billing (EAP)"]}]}, {"n": "Programs", "c": ["Overview", "Runs on Atlassian"]}, {"n": "Reference architecture", "c": ["Work item picker custom field in Jira", "In-app notifications from events", "Manage the 1,000 value limit in custom JQL functions"]}]}, {"n": "Build", "c": [{"n": "Development life cycle", "c": ["Environment configuration", "Forge MCP Server", {"n": "Contributors", "c": ["Overview", "Managing contributors"]}, "App versions", {"n": "Testing and debugging", "c": ["Overview", "Debug using IntelliJ", "Debug using VS Code", "Tunneling"]}]}, {"n": "App capabilities", "c": ["Containerized services (EAP)", {"n": "Compute", "c": [{"n": "Functions", "c": ["Invoke functions", "Call an Atlassian app REST API", "Call an Atlassian app GraphQL API", "Verify user permissions for Atlassian app APIs", "Call an external REST API", "Check user account status"]}, {"n": "Web triggers", "c": ["Work with web triggers"]}, {"n": "Queues", "c": ["Use async app event queues"]}, {"n": "Events", "c": ["Platform and Atlassian app events"]}, {"n": "App REST APIs", "c": ["Overview", "Expose Forge app REST APIs", "Access REST APIs exposed by a Forge app", "Reference"]}]}, {"n": "Storage", "c": ["Key value store", "Entity store", "SQL", "Reference", "Hosted storage data lifecycle"]}, {"n": "Realtime", "c": ["Overview", "Authorizing channels"]}, {"n": "Remotes", "c": ["Overview", "Forge Remote essentials", "Send events to a remote", "Schedule triggers to invoke a remote", {"n": "Call Forge storage from a remote", "c": ["Using REST API (recommended)", "Using GraphQL"]}, "Call Atlassian app APIs from a remote", "Call from a Forge frontend", "Call from a Forge function", "Bitbucket git operations from a remote", "Remote observability", "Set up remotes for data residency realm pinning", "Support data residency realm migrations for Forge Remotes"]}, {"n": "User interface", "c": ["UI Kit", "Frontend bridge", "Display conditions", "Reference"]}, {"n": "Observability", "c": ["Overview", "App observability in third-party tools"]}]}, {"n": "Trust and security", "c": ["Data residency", "Tenant data isolation", {"n": "Configuring app security", "c": ["Unlicensed user app access", "Scopes to call an Atlassian REST API", "Runtime egress permissions", "Content security and egress controls", "App context security"]}, {"n": "External authentication overview", "c": ["Configuring OAuth 2.0 providers", "Rotating an OAuth 2.0 client ID and secret", "Common issues with external authentication"]}]}, "Runs on Atlassian apps", {"n": "Forge compliance", "c": ["Compliance with SOC 2 and ISO 27001", "ISO 27001 responsibilities for Forge Marketplace Partners"]}, {"n": "Enterprise development", "c": ["Using Forge CLI on a corporate network", "Use Forge CLI via a development container"]}, {"n": "Forge releases and deprecation policy", "c": ["Forge releases (includes enrolling in EAP)", "Forge deprecation policy"]}]}, {"n": "Manage", "c": ["Overview", {"n": "Developer spaces", "c": ["Overview of Developer Spaces", "Create a Developer Space", "Work with apps in a Developer Spaces", "Manage roles in Developer Spaces", "Manage Developer Space settings", "Billing and payments in Developer Spaces", "Publish a Developer Space to the Atlassian Marketplace", "Developer Space insights dashboard"]}, {"n": "Observability", "c": [{"n": "Manage app alerts", "c": ["Overview", "Create alert rules", "Manage alert rules", "View open and closed alerts", "Usage alerts"]}, {"n": "Monitor app metrics", "c": ["Overview", "Monitor invocation metrics", "Monitor API metrics", "Monitor custom metrics", "Monitor SQL", "Monitor container metrics (EAP)", "Monitor usage metrics and costs", "Export app metrics", "Export app resource usage"]}, {"n": "Monitor app logs", "c": ["Overview", "View app logs", "Export app logs", "Access app logs"]}, "View app installations", "View app rollouts (Preview)", "View app storage"]}, {"n": "Access", "c": ["Manage app contributors", {"n": "Manage environments", "c": ["Forge environments", "Configuring the manifest", {"n": "Rolling releases (Preview)", "c": ["Overview", "Tutorial"]}]}]}, {"n": "Distribution", "c": ["Marketplace", "Distribute via console", "CLI installation"]}, {"n": "Feature flags", "c": ["Overview", {"n": "Tutorials", "c": ["Your first feature flag", "Page bookmark Confluence app", "Dark mode switcher Confluence app"]}, {"n": "How-to guides", "c": ["Roll out to a percentage of users", "Target specific users or organizations", "Use environment-specific flags"]}, {"n": "Reference", "c": ["Server-side SDK", "Client SDK", "Limitations and constraints"]}, {"n": "Explanation", "c": ["Core concepts", "Client SDK vs server-side SDK"]}]}]}]};

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var CHEVRON = '<span class="fv-ia-drill" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></span>';

  function renderList(items, depth) {
    if (!items || !items.length) return '';
    var html = '<ul class="fv-ia-hlist">';
    items.forEach(function (item) {
      var isObj = item && typeof item === 'object';
      var name = isObj ? item.n : item;
      var kids = isObj ? item.c : null;
      var depthClass = 'fv-ia-node--d' + Math.min(depth, 5);
      html += '<li class="fv-ia-hitem">';
      if (kids && kids.length) {
        html += '<details class="fv-ia-drilldown">';
        html += '<summary class="fv-ia-summary">';
        html += CHEVRON;
        html += '<span class="fv-ia-node ' + depthClass + '">' + esc(name) + '</span>';
        html += '</summary>';
        html += renderList(kids, depth + 1);
        html += '</details>';
      } else {
        html += '<div class="fv-ia-leaf-row"><span class="fv-ia-node ' + depthClass + '">' + esc(name) + '</span></div>';
      }
      html += '</li>';
    });
    html += '</ul>';
    return html;
  }

  function renderColumn(branch) {
    var isObj = branch && typeof branch === 'object';
    var name = isObj ? branch.n : branch;
    var kids = isObj ? branch.c : null;
    var html = '<section class="fv-ia-col">';
    html += '<header class="fv-ia-col-head"><span class="fv-ia-node fv-ia-node--l1">' + esc(name) + '</span></header>';
    html += '<div class="fv-ia-col-body">';
    if (kids && kids.length) html += renderList(kids, 2);
    html += '</div></section>';
    return html;
  }

  function render() {
    var mount = document.getElementById('fv-ia-mount');
    if (!mount) return;
    var branches = FORGE_IA.c || [];
    var html = '';
    html += '<div class="fv-ia-tree">';
    html += '<div class="fv-ia-hscroll" tabindex="0" aria-label="Scroll horizontally to explore the Forge IA">';
    html += '<div class="fv-ia-hrow">';
    html += '<div class="fv-ia-root-col"><div class="fv-ia-node fv-ia-node--root">' + esc(FORGE_IA.n) + '</div></div>';
    html += '<div class="fv-ia-rail" aria-hidden="true"></div>';
    html += '<div class="fv-ia-cols">';
    branches.forEach(function (b) { html += renderColumn(b); });
    html += '</div></div></div>';
    html += '<div class="fv-ia-legend" aria-hidden="true">';
    html += '<span class="fv-ia-legend-item"><span class="fv-ia-legend-swatch" style="background:#DEEBFF;"></span>Root</span>';
    html += '<span class="fv-ia-legend-item"><span class="fv-ia-legend-swatch" style="background:#EAE6FF;"></span>Primary nav</span>';
    html += '<span class="fv-ia-legend-item"><span class="fv-ia-legend-swatch" style="background:#FFF0B3;"></span>Section</span>';
    html += '<span class="fv-ia-legend-item"><span class="fv-ia-legend-swatch" style="background:#F4F5F7;"></span>Page</span>';
    html += '<span class="fv-ia-legend-item"><span class="fv-ia-legend-swatch" style="background:#E3FCEF;"></span>Nested leaf</span>';
    html += '<span class="fv-ia-scroll-hint">Scroll horizontally →</span>';
    html += '</div></div>';
    mount.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
