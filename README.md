```
      console.log(props.nlcdInfo.categories)
      const yearOne = props.nlcdInfo.categories
      const yearTwo = props.nlcdInfo04.categories
      const cOne = Object.keys(yearOne)
        .filter((c) => yearOne[c] > 0)
      const cTwo = Object.keys(yearTwo)
        .filter((c) => yearTwo[c] > 0)
      return [...new Set(cOne.concat(cTwo))]
```
## PROGRESS
* move category squares into their own component and use set to manage reactivity
* try router-link example to manage order of cards


## What needs to be in the store?
* `siteInfo` is the beginning of the store.....extend from there
* as the user requests point data we pack the nlcd info in the store so we only call it when needed
* this will likely be an object that will have a key of COMID which will hold an object that has -> [siteInfo, comparableYears, squareList]
```
store.watersheds = { comid: {
                        siteinfo:{},
                        comparableYears={}, 
                        squareList={}
                        }
                    }
 if not comid in store.watersheds
    then make axios request
```
* every point needs [siteInfo, comparableYears, squareList]
* watersheds
* list of SITE_IDS
* map data?? ->f'sho<-


what kind of patterm do i need for loading map data?
** draw a loop of SiteInfo/(to be cards) created of array of watersheds from state
 alter a current state property like topWatershed OR currentWatershed

* BELOW gets done in a single call to API -- also send back the set([one,two])O

    1     const one = axios.get(`${process.env.VUE_APP_API_URL}/nlcd/2001/${props.siteInfo.COMID}`)$
  60  >->-const two = axios.get(`${process.env.VUE_APP_API_URL}/nlcd/2019/${props.siteInfo.COMID}`)$
    1 $                                                                               
    2     axios.all([one, two]).then(axios.spread((...responses) => {$                
    3       const dOne = responses[0].data$                                           
    4       const dTwo = responses[1].data$                                           
    5       nlcdInfo.value = dOne$                                                    
-   6       nlcdInfo04.value = dTwo$                                                  
    7     }))$  
