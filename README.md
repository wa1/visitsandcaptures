visitsandcaptures
=================

just a basic plugin (built on the existing bookmarks plugin) for keeping track of which portals you have visited and captured.

Basic explanation of the logic of how the visit and cap statuses can affect each other:
===============================

* Clicking capture on a new portal will result in both visit and capture being set to 1 because capturing a portal is done by deploying a resonator which is one way of getting a visit.

* Removing visit will result in capture being removed as well, since you can't capture a portal without also getting the visit. 
