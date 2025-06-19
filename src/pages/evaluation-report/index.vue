<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { searchAssessmentReport } from '@/api/user'

const route = useRoute()
const reportData = ref(null)

onMounted(async () => {
  try {
    const phone = route.query.phone as string
    const agentId = route.query.agent_id as string
    const res = await searchAssessmentReport(phone, agentId, '')
    // const res = mockData
    if (res.code === 200) {
      reportData.value = res.data
    }
    else {
      showToast(res.msg || '获取评估报告失败')
    }
    // reportData.value = mockData
    console.log(reportData)
  }
  catch (error) {
    console.error('Failed to fetch assessment report:', error)
  }
})
</script>

<template>
  <div class="evaluation-report-container">
    <div class="report-header">
      <h1 class="report-title">
        {{ reportData?.basicInform?.agentId || '无' }}-{{ reportData?.basicInform?.userName || '无' }}-评估文档
      </h1>
    </div>

    <div class="report-content">
      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>基本信息</h2>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">评估时间</span>
              <span class="info-value">{{ reportData?.basicInform?.orderTime ? dayjs(reportData?.basicInform?.orderTime).format('YYYY-MM-DD HH:mm') : '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">订单来源</span>
              <span class="info-value">{{ reportData?.basicInform?.orderNo || '无' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>客户信息</h2>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">期望融资额度</span>
              <span class="info-value">{{ reportData?.basicInform?.financingMes?.financingAmount ? `${reportData.basicInform.financingMes.financingAmount}元` : '无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">资金用途</span>
              <span class="info-value">{{ reportData?.basicInform?.financingMes?.financingPurpose || '无' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">大数据级别</span>
              <span class="info-value tag">{{ reportData?.bgLeave || '无' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">征信级别</span>
              <span class="info-value level-badge level-a">{{ reportData?.leave || '无' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">客户标签</span>
              <span class="info-value tag">{{ reportData?.userLabel || '无' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>条件概要</h2>
        </div>
        <div class="card-content">
          <div class="condition-summary">
            <div class="summary-item">
              <div class="summary-label">
                条件汇总：
              </div>
              <div class="summary-content">
                <template v-if="reportData?.basicConditions?.housesConditions?.houses && reportData?.basicConditions?.housesConditions?.houses.length > 0">
                  {{ reportData?.basicConditions?.housesConditions?.houses[0]?.area || '无' }}・
                  {{ reportData?.basicConditions?.housesConditions?.houses[0]?.type || '无' }}
                </template>
                <template v-else>
                  无房产
                </template> |
                <template v-if="reportData?.basicConditions?.securitySituation?.socialSecurityTotalMonths">
                  连续缴{{ reportData?.basicConditions?.securitySituation?.socialSecurityArea || '' }}社保合计{{ reportData?.basicConditions?.securitySituation?.socialSecurityTotalMonths }}个月
                </template>
                <template v-else>
                  无社保
                </template> |
                <template v-if="reportData?.basicConditions?.securitySituation?.socialSecurityCurrentMonths">
                  当前单位{{ reportData?.basicConditions?.securitySituation?.socialSecurityCurrentMonths }}个月
                </template>
                <template v-else>
                  无社保
                </template> |
                <template v-if="reportData?.basicConditions?.enterpriseSituation?.registeredMonths">
                  企业注册{{ reportData?.basicConditions?.enterpriseSituation?.registeredMonths }}个月
                </template>
                <template v-else>
                  无企业
                </template>
                <!--                <template v-if="reportData?.basicInform?.financingMes?.hasDrivingLicense === '是'"> -->
                <!--                  本人驾照 -->
                <!--                </template> -->
                <!--                <template v-else> -->
                <!--                  本人无驾照 -->
                <!--                </template> -->
                <!--                <template v-if="reportData?.basicInform?.financingMes?.spouseHasDrivingLicense === '是'"> -->
                <!--                  | 配偶驾照 -->
                <!--                </template> -->
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                基本属性：
              </div>
              <div class="summary-content">
                {{ reportData?.summaryConditions?.basicAttribute?.sex || '无' }} |
                {{ reportData?.summaryConditions?.basicAttribute?.age || '0' }}岁 |
                {{ reportData?.summaryConditions?.basicAttribute?.address || '无' }} |
                真实婚姻情况：{{ reportData?.summaryConditions?.basicAttribute?.realMaritalStatus || '无' }} |
                征信婚姻状态：{{ reportData?.summaryConditions?.basicAttribute?.creditMaritalStatus || '无' }} |
                {{ reportData?.summaryConditions?.basicAttribute?.education || '无' }}/
                {{ reportData?.summaryConditions?.basicAttribute?.educationCheck || '无' }}/
                {{ reportData?.summaryConditions?.basicAttribute?.educationFullTime || '无' }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                是否可考察：
              </div>
              <div class="summary-content">
                {{ reportData?.summaryConditions?.investigate?.workType || '无' }} | <span
                  v-for="(location, index) in reportData?.summaryConditions?.investigate?.investigateLocations"
                  :key="index" class="location-item"
                ><span class="checked-box">☑</span>{{ location }}</span>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                配偶配合情况：
              </div>
              <div class="summary-content">
                {{ reportData?.basicInform?.financingMes?.spouseAware === '是' ? '配偶可知情' : '配偶不可知情' }} |
                {{ reportData?.basicInform?.financingMes?.spouseCanSign === '是' ? '配偶可共签' : '配偶不可共签' }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                驾驶证情况：
              </div>
              <div class="summary-content">
                本人驾驶证情况：{{ reportData?.basicInform?.financingMes?.hasDrivingLicense || '无' }}
                <template v-if="reportData?.basicInform?.financingMes?.spouseHasDrivingLicense">
                  | 配偶驾驶证情况：{{ reportData?.basicInform?.financingMes?.spouseHasDrivingLicense }}
                </template>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                大数据情况：
              </div>
              <div class="summary-content">
                伽马大数据{{ reportData?.bgLeave }}分
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                特别说明：
              </div>
              <div class="summary-content">
                <!-- 历史黑灰名单情况 -->
                <div
                  v-if="reportData?.exceptionalCase?.specialNote?.blacklistOrgs && reportData?.exceptionalCase?.specialNote?.blacklistOrgs.length > 0"
                  class="special-note-item"
                >
                  <span class="checked-box">☑</span>历史（含5年外）以下机构黑灰名单情况：
                  <span v-for="(org, index) in reportData?.exceptionalCase?.specialNote?.blacklistOrgs" :key="index">
                    {{ org }}<template v-if="index < reportData?.exceptionalCase?.specialNote?.blacklistOrgs.length - 1">, </template>
                  </span>
                </div>

                <!-- 近半年查询记录 -->
                <div
                  v-if="reportData?.exceptionalCase?.specialNote?.queryRecords && reportData?.exceptionalCase?.specialNote?.queryRecords.length > 0"
                  class="special-note-item"
                >
                  <span class="checked-box">☑</span>近半年以下查询记录的原因及细节：
                  <template v-for="(record, index) in reportData?.exceptionalCase?.specialNote?.queryRecords" :key="index">
                    <template v-if="record.loanType === '车贷'">
                      {{ record.org }}<template v-if="index < reportData?.exceptionalCase?.specialNote?.queryRecords.length - 1">
                        ,
                      </template>
                    </template>
                  </template>
                </div>

                <!-- 近五年未结清机构 -->
                <div
                  v-if="reportData?.exceptionalCase?.specialNote?.unpaidLoans && reportData?.exceptionalCase?.specialNote?.unpaidLoans.length > 0"
                  class="special-note-item"
                >
                  <span class="checked-box">☑</span>近五年未结清的以下机构补充：
                  <template v-for="(loan, index) in reportData?.exceptionalCase?.specialNote?.unpaidLoans" :key="index">
                    <template v-if="loan.loanType === '车贷'">
                      {{ loan.org }}<template v-if="index < reportData?.exceptionalCase?.specialNote?.unpaidLoans.length - 1">
                        ,
                      </template>
                    </template>
                  </template>
                </div>

                <!-- 本人特殊情况补充 -->
                <div class="special-note-item">
                  <span class="checked-box">☑</span>{{ reportData?.exceptionalCase?.specialNote?.language || '无' }}
                  <span class="checked-box">☑</span>{{ reportData?.exceptionalCase?.specialNote?.writing || '无' }}
                  <span class="checked-box">☑</span>{{ reportData?.exceptionalCase?.specialNote?.physical || '无' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>基本条件</h2>
        </div>
        <div class="card-content">
          <div class="condition-item">
            <div class="condition-number">
              01
            </div>
            <div class="condition-content">
              <div class="condition-title">
                房产情况 (共{{ reportData?.basicConditions?.housesConditions?.houseCount || '0' }}套):
              </div>
              <div class="condition-detail">
                <template v-if="reportData?.basicConditions?.housesConditions?.houses && reportData?.basicConditions?.housesConditions?.houses.length > 0">
                  <template v-for="(house, index) in reportData?.basicConditions?.housesConditions?.houses" :key="index">
                    <div class="house-item">
                      {{ house.area || '无' }}・{{ house.type || '无' }}・{{ house.status || '无' }}
                      （名下{{ house.ownMonths || '0' }}个月；
                      {{ house.size || '0' }}㎡；
                      {{ house.shareType || '无' }}
                      <template v-if="house.sharePercent && house.shareWith">
                        [占{{ house.sharePercent }}%与{{ house.shareWith }}]
                      </template>；
                      评{{ house.evalPrice || '0' }}万；
                      <template v-if="house.status === '按揭'">
                        按揭{{ house.mortgageAmount || '0' }}万供{{ house.mortgageMonths || '0' }}个月-{{ house.mortgageOrg || '无' }}；
                        <template v-if="house.mortgageSecond === '是'">
                          二押金额{{ house.mortgageSecondAmount || '0' }}万-{{ house.mortgageSecondType || '无' }}-{{ house.mortgageSecondOrg || '无' }}
                        </template>
                      </template>
                      <template v-if="house.status === '抵押'">
                        抵押{{ house.pledgeAmount || '0' }}万供{{ house.pledgeMonths || '0' }}个月-{{ house.pledgeOrg || '无' }}；
                        <template v-if="house.pledgeSecond === '是'">
                          二押金额{{ house.pledgeSecondAmount || '0' }}万-{{ house.pledgeSecondType || '无' }}-{{ house.pledgeSecondOrg || '无' }}
                        </template>
                      </template>
                      ）
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              02
            </div>
            <div class="condition-content">
              <div class="condition-title">
                车产情况:
              </div>
              <div class="condition-detail">
                <template v-if="reportData?.basicConditions?.module3CarData?.hasCar === '是'">
                  （{{ reportData?.basicConditions?.module3CarData?.carType || '无' }}・
                  {{ reportData?.basicConditions?.module3CarData?.carStatus || '无' }}
                  [{{ reportData?.basicConditions?.module3CarData?.carPlateArea || '无' }}牌 |
                  {{ reportData?.basicConditions?.module3CarData?.carMileage || '0' }}KM |
                  <template v-if="reportData?.basicConditions?.module3CarData?.carPlate">
                    车牌号{{ reportData?.basicConditions?.module3CarData?.carPlate }} |
                  </template>
                  <template v-if="reportData?.basicConditions?.module3CarData?.carInvoice">
                    发票{{ reportData?.basicConditions?.module3CarData?.carInvoice }}万 |
                  </template>
                  评{{ reportData?.basicConditions?.module3CarData?.carEval || '0' }}万]；
                  名下{{ reportData?.basicConditions?.module3CarData?.carOwnMonths || '0' }}个月；
                  <template v-if="reportData?.basicConditions?.module3CarData?.carStatus === '按揭'">
                    按揭 [{{ reportData?.basicConditions?.module3CarData?.carMortgageAmount || '0' }}万供{{ reportData?.basicConditions?.module3CarData?.carMortgageMonths || '0' }}个月-{{ reportData?.basicConditions?.module3CarData?.carMortgageOrg || '无' }}]
                  </template>
                  <template v-if="reportData?.basicConditions?.module3CarData?.carStatus === '抵押'">
                    抵押 [{{ reportData?.basicConditions?.module3CarData?.carPledgeAmount || '0' }}万供{{ reportData?.basicConditions?.module3CarData?.carPledgeMonths || '0' }}个月-{{ reportData?.basicConditions?.module3CarData?.carPledgeOrg || '无' }}]
                  </template>
                  ）
                </template>
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              03
            </div>
            <div class="condition-content">
              <div class="condition-title">
                金融资产 (共{{ reportData?.basicConditions?.module3AssetData?.assetCount || '0' }}项):
              </div>
              <div class="condition-detail">
                <template v-if="reportData?.basicConditions?.module3AssetData?.hasAsset === '是' && reportData?.basicConditions?.module3AssetData?.assets && reportData?.basicConditions?.module3AssetData?.assets.length > 0">
                  <div class="asset-list">
                    <template v-for="(asset, index) in reportData?.basicConditions?.module3AssetData?.assets" :key="index">
                      <div class="asset-item">
                        {{ asset.type || '无' }}（持有{{ asset.months || '0' }}个月；当前价值{{ asset.amount || '0' }}万）
                        <template v-if="index < reportData?.basicConditions?.module3AssetData?.assets.length - 1">
                          ，
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              04
            </div>
            <div class="condition-content">
              <div class="condition-title">
                社保|公积金|个税:
              </div>
              <div class="condition-detail">
                <!-- 社保信息 -->
                <div class="security-section">
                  <template v-if="reportData?.basicConditions?.securitySituation?.hasSocialSecurity === '是'">
                    <div class="security-content">
                      缴费主体：{{ reportData?.basicConditions?.securitySituation?.socialSecurityPayer || '无' }} |
                      社保地区：{{ reportData?.basicConditions?.securitySituation?.socialSecurityArea || '无' }} |
                      社保单位全称：{{ reportData?.basicConditions?.securitySituation?.socialSecurityCompany || '无' }} |
                      连续缴社保合计：{{ reportData?.basicConditions?.securitySituation?.socialSecurityTotalMonths || '0' }}个月 |
                      当前单位：{{ reportData?.basicConditions?.securitySituation?.socialSecurityCurrentMonths || '0' }}个月 |
                      近半年平均医疗基数：{{ reportData?.basicConditions?.securitySituation?.medicalBase || '0' }}元 |
                      近半年平均养老基数：{{ reportData?.basicConditions?.securitySituation?.pensionBase || '0' }}元
                      <template v-if="reportData?.basicConditions?.securitySituation?.socialSecurityNote">
                        <div class="security-note">
                          社保补充：{{ reportData?.basicConditions?.securitySituation?.socialSecurityNote }}
                        </div>
                      </template>
                    </div>
                  </template>
                </div>

                <!-- 公积金信息 -->
                <div class="security-section">
                  <div class="security-title">
                    公积金信息：{{ reportData?.basicConditions?.securitySituation?.hasProvidentFund === '是' ? '有公积金' : '无公积金' }}
                  </div>
                  <template v-if="reportData?.basicConditions?.securitySituation?.hasProvidentFund === '是'">
                    <div class="security-content">
                      公积金地区：{{ reportData?.basicConditions?.securitySituation?.providentFundArea || reportData?.basicConditions?.securitySituation?.providentFundCompanyType || '-' }} |
                      <template v-if="reportData?.basicConditions?.securitySituation?.providentFundCompanyType === '同社保单位'">
                        公积金单位名称：{{ reportData?.basicConditions?.securitySituation?.providentFundCompany || reportData?.basicConditions?.securitySituation?.socialSecurityCompany || '无' }} |
                      </template>
                      <template v-else>
                        公积金单位名称：{{ reportData?.basicConditions?.securitySituation?.providentFundCompanyName || '无' }} |
                      </template>
                      连续缴公积金合计：{{ reportData?.basicConditions?.securitySituation?.providentFundTotalMonths || '0' }}个月 |
                      当前单位：{{ reportData?.basicConditions?.securitySituation?.providentFundCurrentMonths || '0' }}个月 |
                      近半年平均公积金基数：{{ reportData?.basicConditions?.securitySituation?.providentFundBase || '0' }}元
                      <template v-if="reportData?.basicConditions?.securitySituation?.providentFundNote">
                        <div class="security-note">
                          公积金补充：{{ reportData?.basicConditions?.securitySituation?.providentFundNote }}
                        </div>
                      </template>
                    </div>
                  </template>
                </div>

                <!-- 个税信息 -->
                <div class="security-section">
                  <div class="security-title">
                    个税信息：{{ reportData?.basicConditions?.securitySituation?.hasTax === '是' ? '有个税' : '无个税' }}
                  </div>
                  <template v-if="reportData?.basicConditions?.securitySituation?.hasTax === '是'">
                    <div class="security-content">
                      个税地区：{{ reportData?.basicConditions?.securitySituation?.taxArea || reportData?.basicConditions?.securitySituation?.taxCompanyType || '-' }} |
                      <template v-if="reportData?.basicConditions?.securitySituation?.taxCompanyType === '同社保单位'">
                        个税单位名称：{{ reportData?.basicConditions?.securitySituation?.taxCompany || reportData?.basicConditions?.securitySituation?.socialSecurityCompany || '无' }} |
                      </template>
                      <template v-else>
                        个税单位名称：{{ reportData?.basicConditions?.securitySituation?.taxCompanyName || '无' }} |
                      </template>
                      连续缴个税合计：{{ reportData?.basicConditions?.securitySituation?.taxTotalMonths || '0' }}个月 |
                      当前单位：{{ reportData?.basicConditions?.securitySituation?.taxCurrentMonths || '0' }}个月 |
                      近半年平均个税税前工资：{{ reportData?.basicConditions?.securitySituation?.taxBase || '0' }}元
                      <template v-if="reportData?.basicConditions?.securitySituation?.taxNote">
                        <div class="security-note">
                          个税补充：{{ reportData?.basicConditions?.securitySituation?.taxNote }}
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              05
            </div>
            <div class="condition-content">
              <div class="condition-title">
                企业情况:
              </div>
              <div class="condition-detail">
                <template v-if="reportData?.basicConditions?.enterpriseSituation?.hasCompany === '是'">
                  <div class="business-info">
                    <div class="business-item">
                      企业全称：{{ reportData?.basicConditions?.enterpriseSituation?.companyName || '无' }}
                    </div>

                    <div class="business-item">
                      工商信息：
                      <template v-if="reportData?.basicConditions?.enterpriseSituation?.businessInfo && reportData?.basicConditions?.enterpriseSituation?.businessInfo.length > 0">
                        {{ reportData?.basicConditions?.enterpriseSituation?.businessInfo.join('，') }}
                      </template>
                      <template v-else>
                        无
                      </template>
                    </div>

                    <div class="business-item">
                      <template v-if="reportData?.basicConditions?.enterpriseSituation?.businessInfo && reportData?.basicConditions?.enterpriseSituation?.businessInfo.includes('法人')">
                        法人名下：{{ reportData?.basicConditions?.enterpriseSituation?.legalPersonMonths || '0' }}个月
                      </template>
                    </div>

                    <div class="business-item">
                      <template v-if="reportData?.basicConditions?.enterpriseSituation?.businessInfo && reportData?.basicConditions?.enterpriseSituation?.businessInfo.includes('股东')">
                        股东名下：{{ reportData?.basicConditions?.enterpriseSituation?.shareholderMonths || '0' }}个月；
                        股东占股：{{ reportData?.basicConditions?.enterpriseSituation?.shareholderPercentage || '0' }}%
                      </template>
                    </div>

                    <div class="business-item">
                      企业注册资金：{{ reportData?.basicConditions?.enterpriseSituation?.registeredCapital || '0' }}万元
                    </div>

                    <div class="business-item">
                      企业注册月数：{{ reportData?.basicConditions?.enterpriseSituation?.registeredMonths || '0' }}个月
                    </div>

                    <div class="business-item">
                      工商是否经营异常：{{ reportData?.basicConditions?.enterpriseSituation?.businessAbnormal || '否' }}
                    </div>

                    <div class="business-item">
                      是否实体：{{ reportData?.basicConditions?.enterpriseSituation?.hasEntity || '否' }}
                    </div>

                    <div class="business-item">
                      经营行业：{{ reportData?.basicConditions?.enterpriseSituation?.businessIndustry || '无' }}
                    </div>

                    <div class="business-item">
                      经营规模：人数{{ reportData?.basicConditions?.enterpriseSituation?.businessStaff || '0' }}人；面积{{ reportData?.basicConditions?.enterpriseSituation?.businessArea || '0' }}平方米
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              06
            </div>
            <div class="condition-content">
              <div class="condition-title">
                流水情况 (共{{ reportData?.basicConditions?.module3FlowData?.flowCount || '0' }}项):
              </div>
              <div class="condition-detail">
                <template v-if="reportData?.basicConditions?.module3FlowData?.hasFlow === '是' && reportData?.basicConditions?.module3FlowData?.flows && reportData?.basicConditions?.module3FlowData?.flows.length > 0">
                  <div class="flow-list">
                    <template v-for="(flow, index) in reportData?.basicConditions?.module3FlowData?.flows" :key="index">
                      <div class="flow-item">
                        <div class="flow-type">
                          流水类别：{{ flow.type || '无' }}
                        </div>

                        <div class="flow-features">
                          流水特点描述：
                          <template v-if="flow.features && flow.features.length > 0">
                            {{ flow.features.join('，') }}
                          </template>
                          <template v-else>
                            无特点
                          </template>
                        </div>

                        <template v-if="flow.salaryAmount">
                          <div class="flow-salary">
                            代发工资：{{ flow.salaryAmount }}元
                          </div>
                        </template>

                        <div class="flow-avg">
                          <template v-if="flow.avgIncome6Months">
                            近6个月月均进账：{{ flow.avgIncome6Months }}万
                          </template>
                          <template v-if="flow.avgIncome12Months">
                            <template v-if="flow.avgIncome6Months">
                              |
                            </template>
                            近12个月月均进账：{{ flow.avgIncome12Months }}万
                          </template>
                        </div>

                        <template v-if="flow.interest && flow.interest.length > 0">
                          <div class="flow-interest">
                            近一年结息：{{ flow.interest.join('，') }}
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>征信情况</h2>
        </div>
        <div class="card-content">
          <!-- 征信后新增部分 -->
          <div class="credit-section">
            <div class="credit-title">
              【征信后新增】
            </div>
            <div class="credit-content">
              <!-- 新增查询明细 -->
              <div v-if="reportData?.creditSituation?.insertCredit?.insertQueriesList && reportData?.creditSituation?.insertCredit?.insertQueriesList.length > 0" class="credit-new-category">
                <div class="credit-new-category-title">
                  新增查询明细：
                </div>
                <div v-for="(item, index) in reportData?.creditSituation?.insertCredit?.insertQueriesList" :key="`query-${index}`" class="credit-new-item">
                  <div class="credit-new-detail">
                    {{ item }}
                  </div>
                </div>
              </div>

              <!-- 新增放款明细 -->
              <div v-if="reportData?.creditSituation?.insertCredit?.insertLoansList && reportData?.creditSituation?.insertCredit?.insertLoansList.length > 0" class="credit-new-category">
                <div class="credit-new-category-title">
                  新增放款明细：
                </div>
                <div v-for="(item, index) in reportData?.creditSituation?.insertCredit?.insertLoansList" :key="`loan-${index}`" class="credit-new-item">
                  <div class="credit-new-detail">
                    {{ item }}
                  </div>
                </div>
              </div>

              <!-- 新增逾期明细 -->
              <div v-if="reportData?.creditSituation?.insertCredit?.insertLoanOverList && reportData?.creditSituation?.insertCredit?.insertLoanOverList.length > 0" class="credit-new-category">
                <div class="credit-new-category-title">
                  新增逾期明细：
                </div>
                <div v-for="(item, index) in reportData?.creditSituation?.insertCredit?.insertLoanOverList" :key="`over-${index}`" class="credit-new-item">
                  <div class="credit-new-detail">
                    {{ item }}
                  </div>
                </div>
              </div>

              <!-- 无征信后新增 -->
              <div
                v-if="(!reportData?.creditSituation?.insertCredit?.insertQueriesList || reportData?.creditSituation?.insertCredit?.insertQueriesList.length === 0)
                  && (!reportData?.creditSituation?.insertCredit?.insertLoansList || reportData?.creditSituation?.insertCredit?.insertLoansList.length === 0)
                  && (!reportData?.creditSituation?.insertCredit?.insertLoanOverList || reportData?.creditSituation?.insertCredit?.insertLoanOverList.length === 0)"
                class="credit-new-detail"
              >
                无征信后新增
              </div>
            </div>
          </div>

          <!-- 负债信息总汇部分 -->
          <div class="credit-section">
            <div class="credit-title">
              【负债信息总汇】
            </div>
            <ul class="credit-list">
              <li>
                <span class="credit-label">总负债：</span>
                <span class="credit-value">总{{
                  reportData?.creditSituation?.totalLiabilities?.grant_amount || '0'
                }}（授信额度）；余{{
                  reportData?.creditSituation?.totalLiabilities?.balance_amount || '0'
                }}（余额）；供{{
                  reportData?.creditSituation?.totalLiabilities?.averageRepaymentLast6Months || '0'
                }}（元）；担保{{
                  reportData?.creditSituation?.totalLiabilities?.guarantee_amount || '0'
                }}（担保金额）</span>
              </li>
              <li>
                <span class="credit-label">信用卡：</span>
                <span class="credit-value">总{{
                  reportData?.creditSituation?.cardInfos?.institution_count || '0'
                }}家（机构数）；总{{
                  reportData?.creditSituation?.cardInfos?.grant_amount || '0'
                }}（授信额度）；已用{{
                  reportData?.creditSituation?.cardInfos?.balance_amount || '0'
                }}（余额）；平均使用率{{ reportData?.creditSituation?.cardInfos?.usage_rate || '0' }}%</span>
              </li>
              <li>
                <span class="credit-label">负债月供：</span>
                <span class="credit-value">{{
                  reportData?.creditSituation?.monthlyDebtPayment?.averageRepaymentLast6Months || '0'
                }}（元）</span>
              </li>
            </ul>
          </div>

          <!-- 征信贷款明细部分 -->
          <div class="credit-section">
            <div class="credit-title">
              【征信贷款明细】
            </div>

            <!-- 小额类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.smallCreditAmount && reportData?.creditSituation?.loanDetailsInfo?.smallCreditAmount.length > 0" class="loan-category">
              <div class="loan-category-title">
                信用小额类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(loan, index) in reportData?.creditSituation?.loanDetailsInfo?.smallCreditAmount" :key="`small-${index}`">
                    <td>{{ loan.grant_date || '-' }}</td>
                    <td>{{ loan.bank_name || '-' }}</td>
                    <td>{{ loan.type || '-' }}</td>
                    <td>{{ loan.grant_amount || '0' }}</td>
                    <td>{{ loan.balance_amount || '0' }}</td>
                    <td>{{ loan.repayment_method || '-' }}</td>
                    <td>{{ loan.termRemainingTotal || '0' }}</td>
                    <td>{{ loan.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 信用非小额类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.nosmallCreditAmount && reportData?.creditSituation?.loanDetailsInfo?.nosmallCreditAmount.length > 0" class="loan-category">
              <div class="loan-category-title">
                信用非小额类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(loan, index) in reportData?.creditSituation?.loanDetailsInfo?.nosmallCreditAmount" :key="`nosmall-${index}`">
                    <td>{{ loan.grant_date || '-' }}</td>
                    <td>{{ loan.bank_name || '-' }}</td>
                    <td>{{ loan.type || '-' }}</td>
                    <td>{{ loan.grant_amount || '0' }}</td>
                    <td>{{ loan.balance_amount || '0' }}</td>
                    <td>{{ loan.repayment_method || '-' }}</td>
                    <td>{{ loan.termRemainingTotal || '0' }}</td>
                    <td>{{ loan.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分期卡类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.installmentCard && reportData?.creditSituation?.loanDetailsInfo?.installmentCard.length > 0" class="loan-category">
              <div class="loan-category-title">
                分期卡类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(loan, index) in reportData?.creditSituation?.loanDetailsInfo?.installmentCard" :key="`installment-${index}`">
                    <td>{{ loan.grant_date || '-' }}</td>
                    <td>{{ loan.bank_name || '-' }}</td>
                    <td>{{ loan.type || '-' }}</td>
                    <td>{{ loan.grant_amount || '0' }}</td>
                    <td>{{ loan.balance_amount || '0' }}</td>
                    <td>{{ loan.repayment_method || '-' }}</td>
                    <td>{{ loan.termRemainingTotal || '0' }}</td>
                    <td>{{ loan.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 信用类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.creditCategory && reportData?.creditSituation?.loanDetailsInfo?.creditCategory.length > 0" class="loan-category">
              <div class="loan-category-title">
                信用类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(loan, index) in reportData?.creditSituation?.loanDetailsInfo?.creditCategory" :key="`credit-${index}`">
                    <td>{{ loan.grant_date || '-' }}</td>
                    <td>{{ loan.bank_name || '-' }}</td>
                    <td>{{ loan.type || '-' }}</td>
                    <td>{{ loan.grant_amount || '0' }}</td>
                    <td>{{ loan.balance_amount || '0' }}</td>
                    <td>{{ loan.repayment_method || '-' }}</td>
                    <td>{{ loan.termRemainingTotal || '0' }}</td>
                    <td>{{ loan.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 抵押类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.mortgageType && reportData?.creditSituation?.loanDetailsInfo?.mortgageType.length > 0" class="loan-category">
              <div class="loan-category-title">
                抵押类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(loan, index) in reportData?.creditSituation?.loanDetailsInfo?.mortgageType" :key="`mortgage-${index}`">
                    <td>{{ loan.grant_date || '-' }}</td>
                    <td>{{ loan.bank_name || '-' }}</td>
                    <td>{{ loan.type || '-' }}</td>
                    <td>{{ loan.grant_amount || '0' }}</td>
                    <td>{{ loan.balance_amount || '0' }}</td>
                    <td>{{ loan.repayment_method || '-' }}</td>
                    <td>{{ loan.termRemainingTotal || '0' }}</td>
                    <td>{{ loan.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 其他类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.otherType && reportData?.creditSituation?.loanDetailsInfo?.otherType.length > 0" class="loan-category">
              <div class="loan-category-title">
                其他类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(loan, index) in reportData?.creditSituation?.loanDetailsInfo?.otherType" :key="`other-${index}`">
                    <td>{{ loan.grant_date || '-' }}</td>
                    <td>{{ loan.bank_name || '-' }}</td>
                    <td>{{ loan.type || '-' }}</td>
                    <td>{{ loan.grant_amount || '0' }}</td>
                    <td>{{ loan.balance_amount || '0' }}</td>
                    <td>{{ loan.repayment_method || '-' }}</td>
                    <td>{{ loan.termRemainingTotal || '0' }}</td>
                    <td>{{ loan.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 担保类 -->
            <div v-if="reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory" class="loan-category">
              <div class="loan-category-title">
                担保类
              </div>
              <table class="loan-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>机构简称</th>
                    <th>业务类型</th>
                    <th>授信总额</th>
                    <th>余额</th>
                    <th>还款方式</th>
                    <th>已供期数</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.grant_date || '-' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.bank_name || '-' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.type || '-' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.grant_amount || '0' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.balance_amount || '0' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.repayment_method || '-' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.termRemainingTotal || '0' }}</td>
                    <td>{{ reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory?.current_status || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 无贷款明细 -->
            <div
              v-if="(!reportData?.creditSituation?.loanDetailsInfo?.smallCreditAmount || reportData?.creditSituation?.loanDetailsInfo?.smallCreditAmount.length === 0)
                && (!reportData?.creditSituation?.loanDetailsInfo?.nosmallCreditAmount || reportData?.creditSituation?.loanDetailsInfo?.nosmallCreditAmount.length === 0)
                && (!reportData?.creditSituation?.loanDetailsInfo?.installmentCard || reportData?.creditSituation?.loanDetailsInfo?.installmentCard.length === 0)
                && (!reportData?.creditSituation?.loanDetailsInfo?.creditCategory || reportData?.creditSituation?.loanDetailsInfo?.creditCategory.length === 0)
                && (!reportData?.creditSituation?.loanDetailsInfo?.mortgageType || reportData?.creditSituation?.loanDetailsInfo?.mortgageType.length === 0)
                && (!reportData?.creditSituation?.loanDetailsInfo?.otherType || reportData?.creditSituation?.loanDetailsInfo?.otherType.length === 0)
                && !reportData?.creditSituation?.loanDetailsInfo?.guaranteeCategory"
              class="no-loan-data"
            >
              无贷款明细
            </div>
          </div>

          <!-- 征信查询情况 -->
          <div class="credit-section">
            <div class="credit-title">
              【征信查询情况】
            </div>
            <div class="credit-query-info">
              <div class="query-item">
                <span class="query-label">最近一次本人查询：</span>
                <span class="query-value">{{ reportData?.creditSituation?.iqueryHistory?.queryDate || '无查询记录' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>特殊情况</h2>
        </div>
        <div class="card-content">
          <div class="special-section">
            <!-- 黑/灰名单情况 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.blacklistOrgs && reportData?.exceptionalCase?.specialNote?.blacklistOrgs.length > 0"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  历史（含5年外）黑/灰名单情况：
                </div>
                <div class="special-detail">
                  <div>
                    {{ reportData?.exceptionalCase?.specialNote?.blacklistOrgs.join('，') || '无' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 黑名单原因 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.blacklistReasons && reportData?.exceptionalCase?.specialNote?.blacklistReasons.length > 0"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  黑名单原因：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(reason, index) in reportData?.exceptionalCase?.specialNote?.blacklistReasons"
                    :key="index"
                  >
                    {{ reason || '未知原因' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 疑似车贷机构查询（近半年） -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.queryRecords && reportData?.exceptionalCase?.specialNote?.queryRecords.some(record => record.loanType === '车贷')"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  疑似车贷机构查询（近半年）：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(record, index) in reportData?.exceptionalCase?.specialNote?.queryRecords.filter(record => record.loanType === '车贷')"
                    :key="index"
                  >
                    {{ record.date || '' }} {{ record.org || '无' }}
                    <span v-if="record.rejectReason">（拒绝原因：{{ record.rejectReason }}）</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 疑似车贷机构放款 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.queryRecords && reportData?.exceptionalCase?.specialNote?.queryRecords.some(record => record.loanType === '车贷' && record.progress === '已批-已放款')"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  疑似车贷机构放款：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(record, index) in reportData?.exceptionalCase?.specialNote?.queryRecords.filter(record => record.loanType === '车贷' && record.progress === '已批-已放款')"
                    :key="index"
                  >
                    {{ record.date || '' }} {{ record.org || '无' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 征信后新增放款补充 - 贷款类 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.newLoans && reportData?.exceptionalCase?.specialNote?.newLoans.loans && reportData?.exceptionalCase?.specialNote?.newLoans.loans.length > 0"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  征信后新增放款补充 - 贷款类：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(loan, index) in reportData?.exceptionalCase?.specialNote?.newLoans.loans"
                    :key="index"
                  >
                    {{ loan.date || '' }} {{ loan.org || '无' }} {{ loan.loanType || '无' }}
                    <span v-if="loan.monthlyPayment">月供{{ loan.monthlyPayment }}元</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 征信后新增放款补充 - 信用卡类 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.newLoans && reportData?.exceptionalCase?.specialNote?.newLoans.creditCards && reportData?.exceptionalCase?.specialNote?.newLoans.creditCards.length > 0"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  征信后新增放款补充 - 信用卡类：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(card, index) in reportData?.exceptionalCase?.specialNote?.newLoans.creditCards"
                    :key="index"
                  >
                    {{ card.date || '' }} {{ card.org || '无' }} {{ card.cardType || '无' }}
                    <span v-if="card.monthlyPayment">月供{{ card.monthlyPayment }}元</span>
                    <span v-if="card.usedLimit">已用额度{{ card.usedLimit }}元</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 历史被拒记录 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.newLoans && reportData?.exceptionalCase?.specialNote?.newLoans.rejectedOrgs && reportData?.exceptionalCase?.specialNote?.newLoans.rejectedOrgs.length > 0"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  历史（含5年外）被拒记录情况：
                </div>
                <div class="special-detail">
                  <div>
                    {{ reportData?.exceptionalCase?.specialNote?.newLoans.rejectedOrgs.join('，') || '无' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 被拒时间及原因 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.newLoans && reportData?.exceptionalCase?.specialNote?.newLoans.rejectReasons && reportData?.exceptionalCase?.specialNote?.newLoans.rejectReasons.length > 0"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  被拒时间及原因：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(reason, index) in reportData?.exceptionalCase?.specialNote?.newLoans.rejectReasons"
                    :key="index"
                  >
                    {{ reason || '未知原因' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 本人特殊情况补充 -->
            <div
              v-if="reportData?.exceptionalCase?.specialNote?.language || reportData?.exceptionalCase?.specialNote?.writing || reportData?.exceptionalCase?.specialNote?.physical"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  本人特殊情况补充：
                </div>
                <div class="special-detail">
                  <div v-if="reportData?.exceptionalCase?.specialNote?.language">
                    语言能力：{{ reportData?.exceptionalCase?.specialNote?.language }}
                  </div>
                  <div v-if="reportData?.exceptionalCase?.specialNote?.writing">
                    写字能力：{{ reportData?.exceptionalCase?.specialNote?.writing }}
                  </div>
                  <div v-if="reportData?.exceptionalCase?.specialNote?.physical">
                    身体状况：{{ reportData?.exceptionalCase?.specialNote?.physical }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 无特殊情况 -->
            <div
              v-if="!reportData?.exceptionalCase?.specialNote?.blacklistReasons?.length
                && !reportData?.exceptionalCase?.specialNote?.queryRecords?.length
                && !reportData?.exceptionalCase?.specialNote?.blacklistOrgs?.length
                && !(reportData?.exceptionalCase?.specialNote?.newLoans?.loans?.length)
                && !(reportData?.exceptionalCase?.specialNote?.newLoans?.creditCards?.length)
                && !(reportData?.exceptionalCase?.specialNote?.newLoans?.rejectedOrgs?.length)
                && !(reportData?.exceptionalCase?.specialNote?.newLoans?.rejectReasons?.length)
                && !reportData?.exceptionalCase?.specialNote?.language
                && !reportData?.exceptionalCase?.specialNote?.writing
                && !reportData?.exceptionalCase?.specialNote?.physical"
              class="special-item"
            >
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  无特殊情况
                </div>
                <div class="special-detail">
                  用户无任何特殊情况记录
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.evaluation-report-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.report-header {
  margin-bottom: 30px;
  position: relative;
  text-align: center;
}

.report-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.report-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4776e6, #8e54e9);
  border-radius: 3px;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(31, 38, 135, 0.15);
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, rgba(71, 118, 230, 0.1), rgba(142, 84, 233, 0.1));
}

.header-decoration {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #4776e6, #8e54e9);
  margin-right: 12px;
  border-radius: 2px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-content {
  padding: 20px 24px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-right: 48px;
  min-width: 200px;
  margin-bottom: 16px;
}

.info-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
}

.level-a {
  background: linear-gradient(135deg, #43cea2, #185a9d);
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(71, 118, 230, 0.1), rgba(142, 84, 233, 0.1));
  border-radius: 16px;
  border: 1px solid rgba(71, 118, 230, 0.3);
}

.condition-item {
  display: flex;
  margin-bottom: 24px;
  position: relative;
}

.condition-item:last-child {
  margin-bottom: 0;
}

.condition-number {
  font-size: 18px;
  font-weight: 700;
  color: #4776e6;
  margin-right: 16px;
  min-width: 30px;
  display: flex;
  align-items: flex-start;
}

.condition-content {
  flex: 1;
}

.condition-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.condition-detail {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  background: rgba(71, 118, 230, 0.05);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid rgba(71, 118, 230, 0.5);
}

.credit-section {
  margin-bottom: 28px;
}

.credit-section:last-child {
  margin-bottom: 0;
}

.credit-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(71, 118, 230, 0.2);
  position: relative;
}

.credit-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #4776e6, #8e54e9);
}

.credit-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.credit-list li {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}

.credit-label {
  font-weight: 500;
  color: #555;
  min-width: 100px;
  margin-right: 8px;
}

.credit-value {
  color: #333;
  flex: 1;
}

.special-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.special-item {
  display: flex;
  align-items: flex-start;
}

.special-icon {
  margin-right: 12px;
  margin-top: 3px;
}

.arrow-icon {
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 0 6px 10px;
  border-color: transparent transparent transparent #4776e6;
}

.special-content {
  flex: 1;
}

.special-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.special-detail {
  color: #555;
  line-height: 1.6;
  background: rgba(71, 118, 230, 0.05);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid rgba(142, 84, 233, 0.5);
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(71, 118, 230, 0.5);
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
}

.checkbox.checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid #4776e6;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.condition-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
}

.summary-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
  margin-right: 12px;
}

.summary-content {
  flex: 1;
  color: #555;
  line-height: 1.6;
}

.checked-box {
  display: inline-block;
  color: #4776e6;
  font-weight: bold;
  margin-right: 4px;
}

.condition-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
}

.summary-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
  margin-right: 12px;
}

.summary-content {
  flex: 1;
  color: #555;
  line-height: 1.6;
}

.checked-box {
  display: inline-block;
  color: #4776e6;
  font-weight: bold;
  margin-right: 4px;
}

.loan-category {
  margin-bottom: 20px;

  .loan-category-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }

  .loan-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;

    th,
    td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: center;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #f1f1f1;
    }
  }
}

.no-loan-data {
  color: #999;
  padding: 15px 0;
  text-align: center;
  font-style: italic;
}

@media (max-width: 768px) {
  .info-item {
    min-width: 100%;
    margin-right: 0;
  }

  .condition-item {
    flex-direction: column;
  }

  .condition-number {
    margin-bottom: 8px;
  }
}
</style>
