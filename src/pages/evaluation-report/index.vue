<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {searchAssessmentReport} from '@/api/user'
import {mockData} from '@/pages/evaluation-report/mock'

const route = useRoute()
const reportData = ref(null)

onMounted(async () => {
  try {
    const phone = route.query.phone as string
    const agentId = route.query.agent_id as string
    const res = await searchAssessmentReport(phone, agentId, '')
    if (res.code === 200) {
      reportData.value = res.data
    } else {
      showToast(res.msg || '获取评估报告失败')
    }
    // reportData.value = mockData
    console.log(reportData)
  } catch (error) {
    console.error('Failed to fetch assessment report:', error)
  }
})
</script>

<template>
  <div class="evaluation-report-container">
    <div class="report-header">
      <h1 class="report-title">
        {{ reportData?.basicInform?.agentId || 'null' }}-{{ reportData?.basicInform?.userName || 'null' }}-评估文档
      </h1>
    </div>

    <div class="report-content">
      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration"/>
          <h2>基本信息</h2>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">评估时间</span>
              <span class="info-value">{{ reportData?.basicInform?.orderTime || 'null' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">订单来源</span>
              <span class="info-value">{{ reportData?.basicInform?.orderNo || 'null' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration"/>
          <h2>客户信息</h2>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">客户要求</span>
              <span class="info-value">{{ reportData?.basicInform?.financingMes?.account || 'null' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">大数据级别</span>
              <span class="info-value level-badge level-a">{{ reportData?.bgLeave || 'null' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">征信级别</span>
              <span class="info-value level-badge level-a">{{ reportData?.leave || 'null' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">客户标签</span>
              <span class="info-value tag">{{ reportData?.userLabel || 'null' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration"/>
          <h2>条件概要</h2>
        </div>
        <div class="card-content">
          <div class="condition-summary">
            <div class="summary-item">
              <div class="summary-label">
                条件汇总：
              </div>
              <div class="summary-content">
                {{ reportData?.basicConditions?.housesConditions?.hasHouse }} |
                {{ reportData?.basicConditions?.housesConditions?.houseCount }} |
                {{ reportData?.basicConditions?.housesConditions?.houses?.area }} |
                {{ reportData?.basicConditions?.housesConditions?.houses?.type }} |
                {{ reportData?.basicConditions?.securitySituation?.socialSecurityTotalMonths }} |
                {{ reportData?.summaryConditions?.conditionAggregation?.companyAge }} |
                {{ reportData?.summaryConditions?.conditionAggregation?.companyAge }} |
                {{ reportData?.summaryConditions?.conditionAggregation?.driverLicense }} |
                {{ reportData?.basicInform?.financingMes?.ydriver }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                基本属性：
              </div>
              <div class="summary-content">
                {{ reportData?.summaryConditions?.basicAttribute?.sex || 'null' }} |
                {{ reportData?.summaryConditions?.basicAttribute?.age || '0' }}岁 |
                {{ reportData?.summaryConditions?.basicAttribute?.address || '无' }} |
                {{ reportData?.summaryConditions?.basicAttribute?.maritalStatus || '无' }} | {{
                  reportData?.summaryConditions?.basicAttribute?.education || '无'
                }}/{{
                  reportData?.summaryConditions?.basicAttribute?.educationCheck || '无'
                }}/{{ reportData?.summaryConditions?.basicAttribute?.educationFullTime || '无' }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                是否可考察：
              </div>
              <div class="summary-content">
                {{ reportData?.summaryConditions?.investigate?.workType || '无' }} | <span
                v-for="(location, index) in reportData?.summaryConditions?.investigate?.investigateLocations"
                :key="index" class="location-item"><span class="checked-box">☑</span>{{ location }}</span>
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                配偶配合情况：
              </div>
              <div class="summary-content">
                {{ reportData?.basicInform?.financingMes?.maritalStatus?.informable || '无' }} |
                {{ reportData?.basicInform?.financingMes?.maritalStatus?.signed || '无' }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                驾驶证情况：
              </div>
              <div class="summary-content">
                {{ reportData?.basicInform?.financingMes?.idriver || '无' }} |
                {{ reportData?.basicInform?.financingMes?.ydriver || '无' }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                大数据情况：
              </div>
              <div class="summary-content">
                伽马大数据30分（补充说明：有被告民事已结案，结案时间2023年06月）
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">
                特别说明：
              </div>
              <div class="summary-content">
                <div
                  v-if="reportData?.summaryConditions?.specialNote?.blacklistReasons && reportData?.summaryConditions?.specialNote?.blacklistReasons.length > 0"
                  class="special-note-item">
                  <span class="checked-box">☑</span>{{
                    reportData?.summaryConditions?.specialNote?.blacklistReasons[0]?.black || '无'
                  }}
                </div>
                <div
                  v-if="reportData?.summaryConditions?.specialNote?.queryRecords && reportData?.summaryConditions?.specialNote?.queryRecords.length > 0"
                  class="special-note-item">
                  <span class="checked-box">☑</span>近半年有{{
                    reportData?.summaryConditions?.specialNote?.queryRecords[0]?.loanType || '无'
                  }}机构查询记录 - {{ reportData?.summaryConditions?.specialNote?.queryRecords[0]?.org || '无' }}
                </div>
                <div
                  v-if="reportData?.summaryConditions?.specialNote?.queryRecords && reportData?.summaryConditions?.specialNote?.queryRecords.length > 0"
                  class="special-note-item">
                  <span class="checked-box">☑</span>历史征信有{{
                    reportData?.summaryConditions?.specialNote?.queryRecords[0]?.loanType || '无'
                  }}机构{{ reportData?.summaryConditions?.specialNote?.queryRecords[0]?.progress || '无' }}记录 -
                  {{ reportData?.summaryConditions?.specialNote?.queryRecords[0]?.org || '无' }}
                </div>
                <div class="special-note-item">
                  <span class="checked-box">☑</span>{{
                    reportData?.summaryConditions?.specialNote?.language || '普通话和粤语情况'
                  }} <span class="checked-box">☑</span>{{
                    reportData?.summaryConditions?.specialNote?.writing || '书写情况'
                  }} <span class="checked-box">☑</span>{{
                    reportData?.summaryConditions?.specialNote?.physical || '身体情况'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration"/>
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
                {{ reportData?.basicConditions?.housesConditions?.hasHouse === 'yes' ? '有房产' : '无房产' }} | {{
                  reportData?.basicConditions?.housesConditions?.houses && reportData?.basicConditions?.housesConditions?.houses.length > 0 ? (reportData?.basicConditions?.housesConditions?.houses[0]?.type || '未知类型') + '・' + (reportData?.basicConditions?.housesConditions?.houses[0]?.status || '未知状态') + '（名下' + (reportData?.basicConditions?.housesConditions?.houses[0]?.ownMonths || '0') + '个月；' + (reportData?.basicConditions?.housesConditions?.houses[0]?.area || '0') + '㎡；' + (reportData?.basicConditions?.housesConditions?.houses[0]?.shareType || '未知共有方式') + ' [占' + (reportData?.basicConditions?.housesConditions?.houses[0]?.sharePercent || '0') + '%与' + (reportData?.basicConditions?.housesConditions?.houses[0]?.shareWith || '未知') + ']；评' + (reportData?.basicConditions?.housesConditions?.houses[0]?.evalPrice || '0') + '万；按揭' + (reportData?.basicConditions?.housesConditions?.houses[0]?.mortgageAmount || '0') + '万供' + (reportData?.basicConditions?.housesConditions?.houses[0]?.mortgageMonths || '0') + '个月；' + ('二押金额' + (reportData?.basicConditions?.housesConditions?.houses[0]?.mortgageSecondAmount || '0') + '万-' + (reportData?.basicConditions?.housesConditions?.houses[0]?.mortgageSecondType || '') + '-' + (reportData?.basicConditions?.housesConditions?.houses[0]?.mortgageSecondOrg || '')) + '）' : '无房产信息'
                }}
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
                {{ reportData?.basicConditions?.module3CarData?.hasCar === 'yes' ? '有车产' : '无车产' }} {{
                  reportData?.basicConditions?.module3CarData?.hasCar === 'yes' ? '（' + (reportData?.basicConditions?.module3CarData?.carStatus || '未知状态') + ' [' + (reportData?.basicConditions?.module3CarData?.carPlateArea || '未知地区') + '牌 | ' + (reportData?.basicConditions?.module3CarData?.carMileage || '0') + 'KM | 评' + (reportData?.basicConditions?.module3CarData?.carEval || '0') + '万]；名下' + (reportData?.basicConditions?.module3CarData?.carOwnMonths || '0') + '个月；按揭 [' + (reportData?.basicConditions?.module3CarData?.carMortgageAmount || '0') + '万供' + (reportData?.basicConditions?.module3CarData?.carMortgageMonths || '0') + '个月-' + (reportData?.basicConditions?.module3CarData?.carMortgageOrg || '未知机构') + ']）' : ''
                }}
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              03
            </div>
            <div class="condition-content">
              <div class="condition-title">
                金融资产:
              </div>
              <div class="condition-detail">
                {{
                  reportData?.basicConditions?.module3AssetData?.hasAsset === 'yes' ? (reportData?.basicConditions?.module3AssetData?.assets && reportData?.basicConditions?.module3AssetData?.assets.length > 0 ? reportData?.basicConditions?.module3AssetData?.assets.map(asset => asset.type + '（' + asset.months + '个月；当前价值' + asset.amount + '万）').join('，') : '有金融资产，但无详细信息') : '无金融资产'
                }}
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
                社保汇总：连{{
                  reportData?.basicConditions?.securitySituation?.socialSecurityTotalMonths || '0'
                }}个月；当前{{
                  reportData?.basicConditions?.securitySituation?.socialSecurityCurrentMonths || '0'
                }}个月；医疗{{ reportData?.basicConditions?.securitySituation?.medicalBase || '0' }}元 |
                养老{{ reportData?.basicConditions?.securitySituation?.pensionBase || '0' }}元<br>
                社保单位：{{ reportData?.basicConditions?.securitySituation?.socialSecurityCompany || '未知' }}
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
                企业汇总：注册{{
                  reportData?.summaryConditions?.conditionAggregation?.companyAge || '0'
                }}个月；{{ reportData?.summaryConditions?.investigate?.workType || '未知类型' }}<br>
                企业名称：{{ reportData?.basicConditions?.securitySituation?.socialSecurityCompany || '未知' }}<br>
                企业补充：{{
                  reportData?.summaryConditions?.investigate?.canInvestigate === 'yes' ? '可考察' : '不可考察'
                }}
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              06
            </div>
            <div class="condition-content">
              <div class="condition-title">
                流水情况:
              </div>
              <div class="condition-detail">
                {{ reportData?.basicConditions?.module3FlowData?.hasFlow === 'yes' ? (reportData?.basicConditions?.module3FlowData?.flows && reportData?.basicConditions?.module3FlowData?.flows.length > 0 ? reportData?.basicConditions?.module3FlowData?.flows.map(flow => flow.type + '（' + (flow.features && flow.features.length > 0 ? flow.features.join('，') : '无特点') + (flow.salaryAmount ? '工资[' + flow.salaryAmount + '元]' : '') + (flow.avgIncome6Months ? '近6个月平均' + flow.avgIncome6Months + '万' : '') + (flow.avgIncome12Months ? '，近12个月平均' + flow.avgIncome12Months + '万' : '') + (flow.interest && flow.interest.length > 0 ? '；结息[' + flow.interest.join('，') + ']' : '') + '）').join('<br>')
                : '有流水，但无详细信息') : '无流水记录' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration"/>
          <h2>征信情况</h2>
        </div>
        <div class="card-content">
          <div class="credit-section">
            <div class="credit-title">
              【征信负债汇总】
            </div>
            <ul class="credit-list">
              <li>
                <span class="credit-label">总负债：</span>
                <span class="credit-value">总{{
                    reportData?.creditSituation?.totalLiabilities?.grant_amount || '0'
                  }}万（不含担保）；余{{
                    reportData?.creditSituation?.totalLiabilities?.balance_amount || '0'
                  }}万；供{{
                    reportData?.creditSituation?.totalLiabilities?.average_repayment || '0'
                  }}万（不含担保）；担保{{
                    reportData?.creditSituation?.totalLiabilities?.guarantee_amount || '0'
                  }}万</span>
              </li>
              <li>
                <span class="credit-label">信用卡：</span>
                <span class="credit-value">总{{
                    reportData?.cardCount || '0'
                  }}家；总{{
                    reportData?.creditSituation?.cardInfos?.grant_amount || '0'
                  }}万；已用{{
                    reportData?.creditSituation?.cardInfos?.balance_amount || '0'
                  }}万（{{ reportData?.creditSituation?.cardInfos?.usage_rate || '0' }}%）</span>
              </li>
              <li>
                <span class="credit-label">负债月供：</span>
                <span class="credit-value">{{
                    reportData?.creditSituation?.monthlyDebtPayment?.averageRepaymentLast6Months || '0'
                  }}万</span>
              </li>
            </ul>
          </div>

          <div class="credit-section">
            <div class="credit-title">
              【征信贷款明细（总{{ reportData?.loanCount || '0' }}笔）】
            </div>
            <!-- 这里可以遍历loanDetailsInfo对象来展示贷款明细 -->
            <div class="condition-item" v-if="reportData?.loans && reportData?.loans.length > 0">
              <div v-for="(loan, index) in reportData?.loans" :key="index" class="condition-item">
                <div class="condition-number">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>
                <div class="condition-content">
                  <div class="condition-title">
                    {{
                      loan.type || '未分类贷款'
                    }}（总{{ reportData?.loanCount && index === 0 ? reportData?.loanCount : '1' }}笔）：
                  </div>
                  <div class="condition-detail">
                    {{ loan.time || '' }} {{ loan.institution || '未知机构' }}（总{{ loan.amount || '0' }}万）
                  </div>
                </div>
              </div>
            </div>

            <div class="condition-item" v-else>
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  暂无贷款记录
                </div>
                <div class="condition-detail">
                  无贷款记录
                </div>
              </div>
            </div>
          </div>

          <div class="credit-section">
            <div class="credit-title">
              【征信查询情况】
            </div>
            <div class="condition-item">
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  最近1次本人查询：
                </div>
                <div class="condition-detail">
                  {{ reportData?.creditSituation?.iqueryHistory?.queryDate || '无记录' }}
                </div>
              </div>
            </div>
            <div class="condition-item">
              <div class="condition-number">
                02
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  查询汇总（含法人查询）
                </div>
                <div class="condition-detail">
                  近1个月{{
                    reportData?.creditSituation?.legalQueryHistory?.m1 || '0'
                  }}次；近3个月{{
                    reportData?.creditSituation?.legalQueryHistory?.m3 || '0'
                  }}次；近6个月{{
                    reportData?.creditSituation?.legalQueryHistory?.m6 || '0'
                  }}次；近12个月{{
                    reportData?.creditSituation?.legalQueryHistory?.m12 || '0'
                  }}次；近24个月{{ reportData?.creditSituation?.legalQueryHistory?.m24 || '0' }}次
                </div>
              </div>
            </div>
            <div class="condition-item">
              <div class="condition-number">
                03
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  查询汇总（不含法人查询）
                </div>
                <div class="condition-detail">
                  近1个月{{
                    reportData?.creditSituation?.noLegalQueryHistory?.m1 || '0'
                  }}次；近3个月{{
                    reportData?.creditSituation?.noLegalQueryHistory?.m3 || '0'
                  }}次；近6个月{{
                    reportData?.creditSituation?.noLegalQueryHistory?.m6 || '0'
                  }}次；近12个月{{
                    reportData?.creditSituation?.noLegalQueryHistory?.m12 || '0'
                  }}次；近24个月{{ reportData?.creditSituation?.noLegalQueryHistory?.m24 || '0' }}次
                </div>
              </div>
            </div>
          </div>

          <div class="credit-section">
            <div class="credit-title">
              【征信逾期情况】
            </div>
            <ul class="credit-list">
              <li>
                <span class="credit-label">逾期汇总：</span>
                <span class="credit-value">{{
                    reportData?.hasOverdue === 'yes' ? '有当前逾期' : '无当前逾期'
                  }} | 半年内{{
                    reportData?.creditSituation?.overdueCount?.m6 || '0'
                  }}次 | 一年内{{
                    reportData?.creditSituation?.overdueCount?.m12 || '0'
                  }}次 | 两年内{{
                    reportData?.creditSituation?.overdueCount?.m24 || '0'
                  }}次 | 两年外{{ reportData?.creditSituation?.overdueCount?.mOut || '0' }}次</span>
              </li>
              <li>
                <span class="credit-label">逾期明细：</span>
              </li>
            </ul>
            <!-- 贷记卡逾期明细 -->
            <div class="condition-item"
                 v-if="reportData?.cardOverdueDetails && reportData?.cardOverdueDetails.length > 0">
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  贷记卡（总{{ reportData?.cardOverdueDetails.length }}次）：
                </div>
                <div class="condition-detail">
                  <div v-for="(overdue, index) in reportData?.cardOverdueDetails" :key="index">
                    {{ overdue.time || '' }} {{ overdue.institution || '未知机构' }}逾期级别{{
                      overdue.level || ''
                    }}金额{{ overdue.amount || '0' }}元
                  </div>
                </div>
              </div>
            </div>

            <!-- 贷款逾期明细 -->
            <div class="condition-item"
                 v-if="reportData?.loanOverdueDetails && reportData?.loanOverdueDetails.length > 0">
              <div class="condition-number">
                {{ reportData?.cardOverdueDetails && reportData?.cardOverdueDetails.length > 0 ? '02' : '01' }}
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  贷款（总{{ reportData?.loanOverdueDetails.length }}次）：
                </div>
                <div class="condition-detail">
                  <div v-for="(overdue, index) in reportData?.loanOverdueDetails" :key="index">
                    {{ overdue.time || '' }} {{ overdue.institution || '未知机构' }}逾期级别{{
                      overdue.level || ''
                    }}金额{{ overdue.amount || '0' }}元
                  </div>
                </div>
              </div>
            </div>

            <!-- 无逾期记录 -->
            <div class="condition-item"
                 v-if="(!reportData?.cardOverdueDetails || reportData?.cardOverdueDetails.length === 0) && (!reportData?.loanOverdueDetails || reportData?.loanOverdueDetails.length === 0)">
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  无逾期记录
                </div>
                <div class="condition-detail">
                  用户征信记录良好，无任何逾期记录
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration"/>
          <h2>特殊情况</h2>
        </div>
        <div class="card-content">
          <div class="special-section">
            <!-- 黑/灰名单情况 -->
            <div class="special-item"
                 v-if="reportData?.exceptionalCase?.specialNote?.blacklistReasons && reportData?.exceptionalCase?.specialNote?.blacklistReasons.length > 0">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  黑/灰名单情况：
                </div>
                <div class="special-detail">
                  <div v-for="(blacklist, index) in reportData?.exceptionalCase?.specialNote?.blacklistReasons"
                       :key="index">
                    {{ blacklist.black || '未知机构' }}黑/灰名单（原因： {{ blacklist.reasons || '未知原因' }}）
                  </div>
                </div>
              </div>
            </div>

            <!-- 疑似年贷机构查询（近半年） -->
            <div class="special-item"
                 v-if="reportData?.exceptionalCase?.specialNote?.queryRecords && reportData?.exceptionalCase?.specialNote?.queryRecords.length > 0">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  疑似年贷机构查询（近半年）：
                </div>
                <div class="special-detail">
                  <div v-for="(query, index) in reportData?.exceptionalCase?.specialNote?.queryRecords" :key="index">
                    {{ query.date || '' }} {{ query.org || '未知机构' }}-查询原因-{{ query.loanType || '未知类型' }}（{{
                      query.progress === 'reject' ? '被拒[原因： ' + (query.rejectReason || '未知') + ']' :
                        query.progress === 'approve' ? '批款-放款[放款时间： ' + (query.date || '未知') + ']' :
                          query.progress === 'approve-non-loan' ? '批款-未放款[原因： ' + (query.rejectReason || '未知') + ']' : '未知进度'
                    }}）
                  </div>
                </div>
              </div>
            </div>

            <!-- 疑似年贷机构被拒（含五年前） - 可以基于同样的数据过滤显示被拒的记录 -->
            <div class="special-item"
                 v-if="reportData?.exceptionalCase?.specialNote?.queryRecords && reportData?.exceptionalCase?.specialNote?.queryRecords.filter(q => q.progress === 'reject').length > 0">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  疑似年贷机构被拒（含五年前）：
                </div>
                <div class="special-detail">
                  <div
                    v-for="(query, index) in reportData?.exceptionalCase?.specialNote?.queryRecords.filter(q => q.progress === 'reject')"
                    :key="index">
                    {{ query.date || '' }} {{ query.org || '未知机构' }}-{{ query.loanType || '未知类型' }}（被拒原因：
                    {{ query.rejectReason || '未知原因' }}）
                  </div>
                </div>
              </div>
            </div>

            <!-- 普通话/粤语 -->
            <div class="special-item" v-if="reportData?.exceptionalCase?.specialNote?.language">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  普通话/粤语：
                </div>
                <div class="special-detail">
                  <div class="checkbox-item">
                    <span>{{ reportData?.exceptionalCase?.specialNote?.language || '无特殊情况' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 写字能力 -->
            <div class="special-item" v-if="reportData?.exceptionalCase?.specialNote?.writing">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  写字能力：
                </div>
                <div class="special-detail">
                  <div class="checkbox-item">
                    <span>{{ reportData?.exceptionalCase?.specialNote?.writing || '无特殊情况' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 身体缺陷 -->
            <div class="special-item" v-if="reportData?.exceptionalCase?.specialNote?.physical">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  身体缺陷：
                </div>
                <div class="special-detail">
                  <div class="checkbox-item">
                    <span>{{ reportData?.exceptionalCase?.specialNote?.physical || '无特殊情况' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 当所有特殊情况都没有时，显示无特殊情况 -->
            <div class="special-item" v-if="!reportData?.exceptionalCase?.specialNote?.blacklistReasons?.length &&
                                          !reportData?.exceptionalCase?.specialNote?.queryRecords?.length &&
                                          !reportData?.exceptionalCase?.specialNote?.language &&
                                          !reportData?.exceptionalCase?.specialNote?.writing &&
                                          !reportData?.exceptionalCase?.specialNote?.physical">
              <div class="special-icon">
                <i class="arrow-icon"/>
              </div>
              <div class="special-content">
                <div class="special-title">
                  特殊情况：
                </div>
                <div class="special-detail">
                  无任何特殊情况记录
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
